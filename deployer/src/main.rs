// extern crate scoped_threadpool;
// extern crate duct;
extern crate ws;

use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use std::sync::mpsc::channel;

// use std::sync::mpsc::Sender as mpsc_sender;
// use std::sync::mpsc::Receiver as mpsc_receiver;
// use std::thread::sleep;
// use ws::CloseCode;
// use ws::Handler;
use std::thread;
use ws::{listen, Message};

// use std::thread;
// use std::time::Duration;

// fn main() {
//   listen("127.0.0.1:3012", |sender| {
//     // let sender_clone = sender.clone();
//     move |msg: Message| {
//       if msg.as_text().ok().unwrap_or("fail") == "start" {
//         let mut child = duct::cmd!("sh", "-c", "echo foo && echo bar 2>&1").stderr_to_stdout().run().unwrap();
//         // sender.send(Message::Text("heello").to_string())
//         if let Some(ref mut stdout) = child.stdout {
//           let lines = BufReader::new(stdout).lines().enumerate();
//           for (counter, line) in lines {
//             println!("{}, {:?}", counter, line);

//             // send std out back to the connection
//             sender
//               .send(Message::Text(line.expect("empty line string")))
//               .expect("failed to send");
//           }
//         }
//       }
//       sender.send(Message::Text("heello".to_string()))
//     }
//   }).unwrap();
// }

fn main() {
  listen("127.0.0.1:3012", |sender| {
    move |msg: Message| {
      // Listen for initial "start" message to be sent
      if msg.as_text().ok().unwrap_or("fail") == "start" {
        sender.send(msg).expect("failed sending");
        sender
          .send(Message::Text("starting".to_string()))
          .expect("failed sending");

        let child = Command::new("terraform")
          .args(&["plan"])
          .stdout(Stdio::piped())
          .stderr(Stdio::piped())
          .current_dir("/home/lawrence/source/tf/azure-aks-terraform")
          .spawn()
          .expect("failed to execute process");

        let (input, output) = channel();
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

        while true {
          let line = output.recv().unwrap();
          sender.send(Message::Text(line)).expect("didn't send")
        }

        return sender.send(Message::Text(format!("Done edit code: {}", 0)));
      }

      // Send done once the iteration has finished
      sender.send(Message::Text("Done".to_string()))
    }
  }).unwrap()
}

// fn channel_server() {
//   // Data to be sent across WebSockets and channels
//   let (input, output) = channel();

//   // WebSocket connection handler for the server connection
//   struct Server {
//     ws: ws_sender,
//     input: mpsc_sender<String>,
//     output: mpsc_receiver<String>
//   }

//   impl Handler for Server {
//     fn on_message(&mut self, msg: Message) -> Result<()> {
//       println!("Server got message '{}'. ", msg);
//       // echo it back
//       // self.output.send(msg.to_string()).expect("send to channel failed")

//       self.ws.send(Message::Text(self.output.recv().unwrap()))
//     }

//     fn on_close(&mut self, _: CloseCode, _: &str) {
//       self.ws.shutdown().unwrap()
//     }
//   }

//   // Server thread
//   let server = thread::Builder::new()
//     .name("server".to_owned())
//     .spawn(move || {
//       listen("127.0.0.1:3012", |out| {
//         Server {
//           ws: out,
//           // we need to clone the channel because
//           // in theory, there could be many active connections
//           input: input.clone(),
//           output: output,
//         }
//       }).unwrap()
//     }).unwrap();

//   // Give the server a little time to get going
//   sleep(Duration::from_millis(10));
// }
