const express = require('express');
const bodyParser = require('body-parser');
let mongoose = require('mongoose');


mongoose.connect('mongodb://dbuser:develop1992@ds261929.mlab.com:61929/firstdb');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('мы успешно подключились');
});


let vacanciesSchema = mongoose.Schema({
    lastId: Number,
    title: String,
    skills: [{text: String, href: String}],
    date: Number,
    views: Number,
    salary: {
        salaryDown: Number,
        salaryUp: Number,
        currency: String
    },
    locationHref: String,
    location: String,
    companyLogo: String,
    companyHref: String,
    companyName: String,
    companyAbout: String,
    description: mongoose.Schema.Types.Mixed
});

let vacanciesModel = mongoose.model('vacanciesModel', vacanciesSchema);


const app = express();


app.use(bodyParser.urlencoded({extended: true}));



app.get('/vacancies/', (req, res) => {
    vacanciesModel.find(function (err, vacancies) {
        if (err) return console.error(err);
        console.log(vacancies);
        res.status(200).send(vacancies);
    }).limit(5).sort({date: -1});
});


app.get('/vacancies/:vacancy_id', (req, res) => {
    let vacancyId = 0;
    if (req.params['vacancy_id']){
        vacancyId = req.params['vacancy_id'];
    } else (
        vacancyId = 0
    );
    //console.log(vacancyId);
    vacanciesModel.find({lastId: vacancyId}, function (err, vacancies) {
        if (err) return console.error(err);
        if (vacancies.length > 0){
            vacanciesModel.find(function(err, vacancies){
                let vacanciesCount = 0;
                let vacancyList = [];
               vacancies.forEach(function(item, i , vacancies){
                if (item.lastId == vacancyId){
                    console.log(item.lastId);
                    vacanciesCount = 10;
                }
                if (vacanciesCount > 0){
                    vacanciesCount--;
                    console.log(vacanciesCount + ' ' + item.lastId);
                    vacancyList.push(item);
                }
               });
               res.status(200).json(vacancyList);
            }).sort({date: -1});
        } else {
            vacanciesModel.find(function(err, vacancies){
                res.status(200).json(vacancies);
            }).limit(10).sort({date: -1});
        }
    });
});


app.listen(3000, () => {
    console.log('We are live on ' + 3000);
});

