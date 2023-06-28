const {Ice} = require('ice-db');
const db = new Ice();
db.setStorage(process.cwd())
const logging = require('./utils/logging');
const logError = logging.logError

require('dotenv').config()

const router = require('./routes/router');


module.exports = {
    db: db
}


const mongoose = require('mongoose');

// access to mongodb
const mongoUser = process.env.MONGO_USER;
const mongoTest = process.env.MONGO_PASSWORD;
const dbURI = "mongodb+srv://" + mongoUser + ":" + mongoTest + "@samydb.ascchv5.mongodb.net/samydb?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true})
    .then(() => {
        console.log('db connected');
    })
    .catch((err) => {
        logError(err);
    });

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json())

app.use(router);

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, function (err) {
    if (err) logError(err);
    console.log("Server listening on PORT", port);
});

