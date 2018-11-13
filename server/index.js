const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const pty = require('node-pty');
const fs = require('fs');
var cors = require('cors');

console.log(encryptAndSign("barrywhite", keys))

setTimeout(() => {
    console.log("Timedout after 45mins... exiting")
    process.exit(1)
}, 1000 * 60 * 45) // ms in second * seconds in mins * mins  

app.use(cors());

app.get('/alive', function (req, res) {
    res.send("alive");
});

app.ws('/terminal', function (ws, req) {
    console.log('Connected to terminal');
    term = pty.spawn('terraform', ['apply'], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: '/git',
        env: process.env
    });
    console.log('Connected to terminal');


    function buffer(socket, timeout) {
        let s = '';
        let sender = null;
        return (data) => {
            s += data;
            if (!sender) {
                sender = setTimeout(async () => {
                    message = encryption.encryptAndSign(s, keys)
                    socket.send(s);
                    s = '';
                    sender = null;
                }, timeout);
            }
        };
    }
    const send = buffer(ws, 5);

    term.on('close', function () {
        try {
            send("command exited")
        } catch (ex) {
            // The WebSocket is not open
            process.exit()
        }
    });

    term.on('data', function (data) {
        try {
            send(data);
        } catch (ex) {
            // The WebSocket is not open
            process.exit()
        }
    });
    ws.on('message', function (msg) {
        term.write(msg);
    });
    ws.on('close', function () {
        term.kill();
        console.log('Lost Websocket connection - closed terminal ' + term.pid);
        process.exit(1)
    });
});

var port = process.env.PORT || 3012,
    host = '0.0.0.0';

console.log('App listening to http://' + host + ':' + port);
app.use(function(err, req, res, next) {
    if(!err) return next(); // you also need this line
    console.log(err);
    res.send(err.toString());
});
app.listen(port, host);

// Write file to show container is ready 
fs.writeFile("./ready.txt", process.pid.toString(), function(err) {
    if(err) {
        console.log(err);
        process.exit(1);
    }

    console.log("The file was saved!");
}); 
