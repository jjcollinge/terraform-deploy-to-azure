extern crate ws;

use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use ws::{listen, Message};

fn main() {
  listen("127.0.0.1:3012", |sender| {
    move |msg: Message| {
      if msg.as_text().ok().unwrap_or("fail") == "start" {
        let mut child = Command::new("sh")
          .arg("-c")
          .arg("echo hello")
          .stdout(Stdio::piped())
          .stderr(Stdio::piped())
          .spawn()
          .expect("failed to execute process");

        if let Some(ref mut stdout) = child.stdout {
          let lines = BufReader::new(stdout).lines().enumerate();
          for (counter, line) in lines {
            println!("{}, {:?}", counter, line);

            sender.send(Message::Text(line.expect("empty line string"))).expect("failed to send");
          }
        }

      }
      sender.send(Message::Text("Done".to_string()))
    }
  }).unwrap()
}
