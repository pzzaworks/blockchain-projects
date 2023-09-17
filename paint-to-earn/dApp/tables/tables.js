const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

const fetchAndSaveCanvas = require('./utils/fetchAndSaveCanvas');
const emptyCanvas = require('./utils/emptyCanvas');
const randomCanvas = require('./utils/randomCanvas');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = require('http').createServer(app);
const port = process.env.PORT || 4000;

const mysqlPool  = mysql.createPool({
    connectionLimit : process.env.MYSQLCONNECTIONLIMIT,
    host            : process.env.MYSQLHOST,
    user            : process.env.MYSQLUSER,
    password        : process.env.MYSQLPASSWORD,
    database        : process.env.MYSQLDATABASE,
    multipleStatements: process.env.MYSQLMULTIPLESTATEMENTS
});

app.get('/fetchAndSaveCanvas', (request, result) => {
    fetchAndSaveCanvas(result, mysqlPool);
});

app.get('/emptyCanvas', (request, result) => {
    emptyCanvas(result, mysqlPool);
});

app.get('/randomCanvas', (request, result) => {
    randomCanvas(result, mysqlPool);
});

server.listen(port);

global.__basedir = __dirname;
