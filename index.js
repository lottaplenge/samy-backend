const {Ice} = require('ice-db');
const db = new Ice();
db.setStorage(process.cwd())

module.exports = {
    db: db
}

const express = require('express');
const {router} = require('./routes/router.js');

const app = express();

app.use(express.json())

app.use('/api', router);

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});

