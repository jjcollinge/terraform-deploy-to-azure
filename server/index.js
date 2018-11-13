var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var os = require('os');
var pty = require('node-pty');

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
                sender = setTimeout(() => {
                    socket.send(s);
                    s = '';
                    sender = null;
                }, timeout);
            }
        };
    }
    const send = buffer(ws, 5);

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
        console.log('Closed terminal ' + term.pid);
    });
});

var port = process.env.PORT || 3013,
    host = '0.0.0.0';

console.log('App listening to http://' + host + ':' + port);
app.use(function(err, req, res, next) {
    if(!err) return next(); // you also need this line
    console.log(err);
    res.send(err.toString());
});
app.listen(port, host);