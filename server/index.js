const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const pty = require('node-pty');
const fs = require('fs');
const cors = require('cors');
const encryption = require('./encryption.js');

setTimeout(() => {
    console.log("Timedout after 45mins... exiting")
    process.exit(1)
}, 1000 * 60 * 45) // ms in second * seconds in mins * mins  

app.use(cors());

// Healthcheck endpoint
app.get('/alive', function (req, res) {
    // The EncryptionJS file will set the global varible of 
    // once it has loaded the encryption keys
    // until this has happened return 500's
    if (!keysAvailable) {
        res.statusCode = 500;
        res.send("keys not loaded");
        return;
    }

    res.send("alive");
});

// Websocket endpoint
app.ws('/terminal', function (ws, req) {

    console.log('Connected to terminal');
    term = pty.spawn('terraform', ['apply'], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.GIT_DIR || '/git',
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
                    // Encrypt the batch and send
                    let message = await encryption.encryptAndSign(s, keys)
                    socket.send(JSON.stringify(message));
                    s = '';
                    sender = null;
                }, timeout);
            }
        };
    }
    const send = buffer(ws, 5);

    term.on('close', async () => {
        try {
            // send as non buffered to ensure send as individual message
            let message = await encryption.encryptAndSign("command exited", keys)
            ws.send(JSON.stringify(message));
        } catch (ex) {
            // The WebSocket is not open
            process.exit()
        }
    });

    term.on('data', async function (data) {
        try {
            send(data);
        } catch (ex) {
            console.log("Failed encrypting message:")
            console.log(ex);
            // The WebSocket is not open
            ws.close();
        }
    });
    ws.on('message', async function (msg) {
        // Decrypt received messages
        try {
            let messageObj = JSON.parse(msg);
            let result = await encryption.validateAndDecrypt(messageObj, keys);
            if (!result.isValid) {
                send("invalid message");
                ws.close();
            } else {
                term.write(result.message);
            }
        } catch (ex) {
            console.log("Invalid Message received:")
            console.log(ex);
            console.log(msg);
            ws.close();
        }

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
app.use(function (err, req, res, next) {
    if (!err) return next(); // you also need this line
    console.log(err);
    res.send(err.toString());
});
app.listen(port, host);

// Write file to show container is ready 
fs.writeFile("./ready.txt", process.pid.toString(), function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    console.log("The file was saved!");
});
