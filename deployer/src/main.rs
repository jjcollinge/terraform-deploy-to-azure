extern crate ws;

use std::io::Write;
use std::io::{BufRead, BufReader, BufWriter};
use std::process::{Command, Stdio};
use std::sync::mpsc::channel;
use std::time::Duration;

use std::sync::mpsc::Receiver as mpsc_receiver;
use std::sync::mpsc::Sender as mpsc_sender;
use std::thread;
use std::thread::sleep;
use ws::CloseCode;
use ws::Handler;
use ws::{listen, Message, Result, Sender as ws_sender};

fn main() {
  println!("Starting Terraform Deployer Websocket server");

  // Data to be sent across WebSockets and channels
  let (tx_connections, rx_connections) = channel::<ws::Sender>();
  let (tx_stdin, rx_stdin) = channel();

  let socket = ws::Builder::new()
    .build(move |out: ws::Sender| {
      // When we get a connection, send a handle to the parent thread
      println!("New connection received");
      let tx_stdin = tx_stdin.clone();
      let tx_connections_reciever = tx_connections.clone();

      // Dummy message handler
      move |msg: Message| {
        let msg_str = msg.into_text().unwrap();
        println!("Message handler called. {}", msg_str);

        if msg_str == "start" {
          // Kick off terraform
          tx_connections_reciever
            .send(out.clone())
            .expect("send connection failed");
        } else if msg_str == "yes\n" || msg_str == "cancel\n" {
          // Send stdin
          tx_stdin.send(msg_str).expect("send stdin failed");
        } else {
          out.send(Message::Text(format!("Invalid command sent '{}'", msg_str))).expect("send invalid command failed");
          out.close(ws::CloseCode::Invalid).expect("connection close failed");
        }
        Ok(())
      }
    }).unwrap();

  let handle = socket.broadcaster();

  let _t = thread::spawn(move || {
    socket.listen("0.0.0.0:3012").unwrap();
    println!("Server started");
  });

  // Wait 600 seconds for a connection to be made
  let d = Duration::from_secs(600);
  let connection = rx_connections.recv_timeout(d).unwrap();

  // Create a channel for both stdout and stderr to write too
  let (input, combinded_cmd_output) = channel();

  let mut stdin_pipe = start_terraform(input);

  // Create a writer for the stdin of the process
  let mut stdin_writer = BufWriter::new(&mut stdin_pipe);

  loop {
    // Handle receiving input over the websocket
    // send the txt to stdin
    let stdin = rx_stdin.try_recv();
    if !stdin.is_err() {
      let stdin_txt = stdin.unwrap();

      // Write message into stdin
      stdin_writer.write_all(stdin_txt.as_bytes()).unwrap();
      stdin_writer.flush().unwrap();

      // Log and echo back to client
      println!(
        "Message received: {} bytes: {:?}",
        stdin_txt,
        stdin_txt.as_bytes()
      );
      connection
        .send("Written back to stdin".to_string())
        .unwrap();
      connection.send(Message::Text(stdin_txt)).unwrap();
    }

    // Check if any new connections have been made
    // as we only support 1 connection at a time close them
    // with an invalid error code
    let new_connection = rx_connections.try_recv();
    if !new_connection.is_err() {
      new_connection
        .unwrap()
        .close(ws::CloseCode::Invalid)
        .unwrap();
    }

    // Check for new output from the command
    let cmd_output = combinded_cmd_output.try_recv();
    let cmd_output = match cmd_output {
      Ok(txt) => txt,
      Err(error) if error == std::sync::mpsc::TryRecvError::Disconnected => {
        // This means both the senders have disconnected for stdout and stderr which
        // means the process has exited.
        connection
          .send(Message::Text("command exited".to_string()))
          .unwrap();

        // Shutdown the server and exit
        handle.shutdown().unwrap();
        println!("Shutting down server because no connections were established.");
        return;
      }
      // This case handles when the process is still running but hasn't output any
      // the lines to the console
      Err(error) if error == std::sync::mpsc::TryRecvError::Empty => continue,
      Err(_) => continue,
    };

    // Send the new line to the client over it's connection
    connection.send(Message::Text(cmd_output)).unwrap();

    std::thread::sleep_ms(20);
  }
}

fn start_terraform(input: mpsc_sender<String>) -> std::process::ChildStdin {
  // When a connection is made start TF client
  let child = Command::new("terraform")
    .args(&["apply"])
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .stdin(Stdio::piped())
    .env("TF_LOG", "WARN")
    .current_dir("/git")
    .spawn()
    .expect("failed to execute process");

  // Create clones and copies for use by the stdout reader thread
  let stdout_input = input.clone();
  let stdout_pipe = child.stdout.unwrap();

  // Start thread to read from stdout
  thread::spawn(move || {
    let lines = BufReader::new(stdout_pipe).lines().enumerate();
    for (counter, line) in lines {
      println!("{}, {:?}", counter, line);
      stdout_input
        .send(line.expect("failed reading line"))
        .expect("send to chan failed")
    }

    // If the pipe has returned EOF it means the
    // process has exited. Close the sender
    drop(stdout_input)
  });

  // Create clones and copies for use by the stderr reader thread
  let stderr_input = input.clone();
  let stderr_pipe = child.stderr.unwrap();

  // Start thread to read from stderr
  thread::spawn(move || {
    let lines = BufReader::new(stderr_pipe).lines().enumerate();
    for (counter, line) in lines {
      println!("{}, {:?}", counter, line);

      // send std out back to the connection
      stderr_input
        .send(line.expect("failed reading line"))
        .expect("send to chan failed")
    }

    // If the pipe has returned EOF it means the
    // process has exited. Close the sender
    drop(stderr_input)
  });

  // drop the main sender that we cloned from for each of the threads
  drop(input);

  let mut stdin_pipe = child.stdin.unwrap();

  return stdin_pipe;
}

#[cfg(test)]
mod tests {
  extern crate ws;

  use main;
  use std::thread;
  use ws::Message;

  use ws::connect;

  #[test]
  fn test_accept_works() {
    // Start server
    let t = thread::spawn(move || main());

    // Connect to the url and call the closure
    if let Err(error) = connect("ws://localhost:3012", |out| {
      thread::spawn(move || {
        std::thread::sleep_ms(300);

        // Queue a message to be sent when the WebSocket is open
        if out.send("start").is_err() {
          panic!("Websocket couldn't queue an initial message.")
        } else {
          println!("Client sent message 'start'. ")
        }

        std::thread::sleep_ms(8000);

        // Queue a message to be sent when the WebSocket is open
        if out.send("yes\n").is_err() {
          panic!("Websocket couldn't queue acceptance message.")
        } else {
          println!("Client sent message 'yes\n'. ")
        }
      });

      move |msg: Message| {
        println!("Message handler called. {}", msg);
        Ok(())
      }
    }) {
      // Inform the user of failure
      println!("Failed to create WebSocket due to: {:?}", error);
    }
  }
}