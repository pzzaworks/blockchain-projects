const express = require('express');
const routesHandler = require('./routes/handler');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/', routesHandler);

const port = 4000;
app.listen(port, () => {});

global.__basedir = __dirname;