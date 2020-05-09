const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');

const routes = require(path.join(__dirname, 'routes', 'router.js'))

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(routes);

mongoose.connect('mongodb+srv://admin:cSu1uSrUcEfwm4H3@sandbox-r1nxa.mongodb.net/test?retryWrites=true&w=majority')
    .then(result => {
        console.log('connected to db...');
        app.listen(3000);
        console.log('listening...');
    })
    .catch(err => {console.log(err)})