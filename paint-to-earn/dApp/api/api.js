const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const mysql = require('mysql');
require('dotenv').config();
const formidable = require('formidable');

const loadPixel = require('./utils/loadPixel');
const loadCanvas = require('./utils/loadCanvas');
const savePixel = require('./utils/savePixel');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = require('http').createServer(app);
const port = process.env.PORT || 4000;
const io = new Server(server, {
    cors: {
        origin: ["https://painttoearn.io", "https://www.painttoearn.io"],
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

const mysqlPool  = mysql.createPool({
    connectionLimit : process.env.MYSQLCONNECTIONLIMIT,
    host            : process.env.MYSQLHOST,
    user            : process.env.MYSQLUSER,
    password        : process.env.MYSQLPASSWORD,
    database        : process.env.MYSQLDATABASE,
    multipleStatements: process.env.MYSQLMULTIPLESTATEMENTS
});

io.on('connection', (socket) => {
    socket.on('loadPixel', (currentSelectedPixel) => {
        loadPixel(io, mysqlPool, currentSelectedPixel);
    });
});

app.get('/loadCanvas', (request, result) => {
    loadCanvas(result, mysqlPool);
});

app.post('/savePixel', (request, result) => {
    let savePixelForm = new formidable.IncomingForm();  

    savePixelForm.parse(request, (error, fields, files) => {
        savePixel(result, fields, mysqlPool);
    });
});

app.get('/', (request, result) => {
    result.status(200).redirect("https://painttoearn.io")
});

server.listen(port);

global.__basedir = __dirname;
