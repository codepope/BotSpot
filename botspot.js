'use strict';
/* jshint node:true */

// Add the express web framework
const express = require('express');
const { spawn } = require('child_process');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(fileUpload());

var status = {
    output:"",
    err:"",
    closed:true
}

var py;

function startPy() {
    if (!status.closed) { return; }
    
    status.closed = false;
    status.output = "";
    status.err = "";

    py = spawn('python', ['/tmp/filename.py']);


    py.stdout.on('data', (data) => {
        status.output = status.output + data.toString();
    });

    py.stderr.on('data', (data) => {
        status.err = status.err + data.toString();
    });

    py.on('close', (code) => {
        status.closed = true;
    });
}

app.post('/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/tmp/filename.py', function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.redirect("/");
    });
});

app.get('/run', function (req, res) {
    startPy();
    res.sendStatus(200);
})

app.get("/status", function (req, res) {
    res.json(status);
});

app.use(express.static(__dirname + '/public'));

// Listen for a connection.
app.listen(port, function () {
    console.log('Server is listening on port ' + port);
});
