const {Ice} = require('ice-db');
const db = new Ice();
db.setStorage(process.cwd())

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
        console.log(err);
    });

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json())

app.use(router);

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});

const School = require('./models/school');
const fs = require('fs');

/*fs.readFile('./assets/schools_leipzig.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    const schoolData = JSON.parse(data);
    for(let i = 0; i < schoolData.length; i++){
        let privateSchool = "";
        if(schoolData[i].hasOwnProperty('privateschool')) privateSchool = schoolData[i].privateschool;
        else if(schoolData[i].hasOwnProperty('Schule in freier Trägerschaft')) privateSchool = schoolData[i]['Schule in freier Trägerschaft'];
        const school = new School({
            schoolType: schoolData[i].schooltype,
            privateSchool: privateSchool,
            schoolName: schoolData[i].schoolname,
            street: schoolData[i].address['street'],
            postCode: schoolData[i].address['postal code'],
            city: schoolData[i].address['city'],
            website: schoolData[i].website,
            phone : schoolData[i].phone,
            languages: schoolData[i].languages,
        });

        school.save()
            .then(result => {
                console.log("success");
            })
            .catch(err =>{
                console.error(err, school);
            });
    }
});*/


