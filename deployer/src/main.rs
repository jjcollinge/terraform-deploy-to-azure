// extern crate scoped_threadpool;
// extern crate duct;
extern crate ws;

use std::io::{BufRead, BufReader};
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

// fn main() {
//   listen("127.0.0.1:3012", |sender| {
//     move |msg: Message| {
//       // Listen for initial "start" message to be sent
//       if msg.as_text().ok().unwrap_or("fail") == "start" {
//         sender.send(msg).expect("failed sending");
//         sender
//           .send(Message::Text("starting".to_string()))
//           .expect("failed sending");

//

//         while true {
//           let line = output.recv().unwrap();
//           sender.send(Message::Text(line)).expect("didn't send")
//         }

//         return sender.send(Message::Text(format!("Done edit code: {}", 0)));
//       }

//       // Send done once the iteration has finished
//       sender.send(Message::Text("Done".to_string()))
//     }
//   }).unwrap()
// }

fn main() {
  // Data to be sent across WebSockets and channels
  let (tx, rx) = channel::<ws::Sender>();
  let (tx_stdin, rx_stdin) = channel();

  let socket = ws::Builder::new()
    .build(move |out: ws::Sender| {
      // When we get a connection, send a handle to the parent thread
      tx.send(out).unwrap();
      let tx_stdin = tx_stdin.clone();

      // Dummy message handler
      move |msg: Message| {
        let msgStr = msg.into_text().unwrap();
        println!("Message handler called. {}", msgStr);
        tx_stdin.send(msgStr).expect("send failed");
        Ok(())
      }
    }).unwrap();

  let handle = socket.broadcaster();

  let t = thread::spawn(move || {
    socket.listen("127.0.0.1:3013").unwrap();
  });

  let d = Duration::from_secs(600);
  let connection = rx.recv_timeout(d).unwrap();

  let child = Command::new("terraform")
    .args(&["plan"])
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .current_dir("/home/lawrence/source/tf/azure-aks-terraform")
    .spawn()
    .expect("failed to execute process");

  let (input, combinded_cmd_output) = channel();
  let stdout_input = input.clone();
  let stderr_input = input.clone();

  let stdout_pipe = child.stdout.unwrap();
  let stderr_pipe = child.stderr.unwrap();

  thread::spawn(move || {
    // loop through stdout returned from command
    // if let Some(ref mut stdout) = stdout_pipe {
    let lines = BufReader::new(stdout_pipe).lines().enumerate();
    for (counter, line) in lines {
      println!("{}, {:?}", counter, line);
      stdout_input
        .send(line.expect("failed reading line"))
        .expect("send to chan failed")
    }
    // }
  });

  thread::spawn(move || {
    let lines = BufReader::new(stderr_pipe).lines().enumerate();
    for (counter, line) in lines {
      println!("{}, {:?}", counter, line);

      // send std out back to the connection
      stderr_input
        .send(line.expect("failed reading line"))
        .expect("send to chan failed")
    }
  });

  loop {
    // if connection. {
    //   handle.shutdown().unwrap();
    //   println!("Shutting down server because no connections were established.");
    //   return
    // }

    let cmd_output = combinded_cmd_output.try_recv();
    if !cmd_output.is_err() {
      let cmd_txt = cmd_output.unwrap();
      connection.send(Message::Text(cmd_txt));
    }

    let stdin = rx_stdin.try_recv();
    if !stdin.is_err() {
      let stdin_txt = stdin.unwrap();
      println!("Message received {}", stdin_txt);
      connection.send(Message::Text(stdin_txt));
    }
  }
}
