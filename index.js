const {Ice} = require('ice-db');
const db = new Ice();
db.setStorage(process.cwd())

const dbRoutes = require('./routes/dbRoutes');


module.exports = {
    db: db
}


const mongoose = require('mongoose');

// access to mongodb
const dbURI = "mongodb+srv://testuser:asdf@samydb.ascchv5.mongodb.net/samydb?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true})
    .then(() => {
        console.log('db connected');
    })
    .catch((err) => {
        console.log(err);
    });

const express = require('express');
const {router} = require('./routes/router.js');
const User = require("./models/user");
const app = express();

app.use(express.json())

app.use('./routes/router', router);
app.use(dbRoutes);

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});

