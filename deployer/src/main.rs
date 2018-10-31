extern crate ws;

use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use ws::{listen, Message};

fn main() {
  listen("127.0.0.1:3012", |sender| {
    move |msg: Message| {
      // Listen for initial "start" message to be sent
      if msg.as_text().ok().unwrap_or("fail") == "start" {
        let mut child = Command::new("sh")
          .arg("-c")
          .arg("terraform")
          .arg("plan")
          .stdout(Stdio::piped())
          .stderr(Stdio::piped())
          .current_dir("/home/lawrence/source/tf/azure-aks-terraform")
          .spawn()
          .expect("failed to execute process");

        // loop through stdout returned from command
        if let Some(ref mut stdout) = child.stdout {
          let lines = BufReader::new(stdout).lines().enumerate();
          for (counter, line) in lines {
            println!("{}, {:?}", counter, line);
            
            // send std out back to the connection
            sender.send(Message::Text(line.expect("empty line string"))).expect("failed to send");
          }
        }

        let exit_code = child.wait().expect("failed to get exit code");
        return sender.send(Message::Text(format!("Done edit code: {}", exit_code.code().unwrap())));
      }

      // Send done once the iteration has finished
      sender.send(Message::Text("Done".to_string()))
    }
  }).unwrap()
}
