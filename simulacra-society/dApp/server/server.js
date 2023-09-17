const express = require('express');
const path = require('path');
const mailChimp = require('mailchimp-api-v3');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mc_api_key = process.env.MailChimp_API_Key;
const list_id = process.env.MailChimp_ListId;

const newMailChimp = new mailChimp(mc_api_key);

app.use(express.static(path.join(__dirname, './public')));

app.get("/server/memberAdd", (req, res) => {
    newMailChimp.post(`/lists/${list_id}/members/`, {
            email_address: req.query.email,
            status: "subscribed"
        })
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
});

app.get("/server", (req, res) => {
    res.send("Server is running!");
});

//const port = process.env.PORT || 4000;
//app.listen(port, () => {});

app.listen();

//console.log(`Express listening on port ${port}`)