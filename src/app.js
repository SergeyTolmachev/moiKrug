const express = require('express');
const bodyParser = require('body-parser');
let mongoose = require('mongoose');
const vacanciesSchema = require('./schemas/vacanciesSchema');
const db = require('./config/mongodbConnect');


let vacanciesModel = mongoose.model('vacanciesModel', vacanciesSchema.vacanciesSchema);


const app = express();


app.use(bodyParser.urlencoded({extended: true}));


app.get('/vacancies/', (req, res) => {
    let page;
    let pageSkips;
    let queryToDatabase = {};
    queryToDatabase.salary = {};


    page = req.query.page || 1;

    pageSkips = (page - 1) * 10;
    if (req.query.salary === 'true') {
        queryToDatabase = {'salary.currency': {$ne: null}};

    }

    if (req.query.remote === 'false') {
        queryToDatabase.remote = false;
    }

    if (req.query.remote === 'true') {
        queryToDatabase.remote = true;
    }


    if (req.query.fullDay === 'false') {
        queryToDatabase.fullDay = false;
    }

    if (req.query.fullDay === 'true') {
        queryToDatabase.fullDay = true;
    }


    if (req.query.location) {
        queryToDatabase.location = 'Россия, ' + req.query.location;
    }


    console.log(JSON.stringify(queryToDatabase, null, 4));

    vacanciesModel.find(queryToDatabase, {
        "description": 0,
        "skills": 0
    }, function (err, vacancies) {
        if (err) return console.error(err);
        res.status(200).json(vacancies);
    }).skip(pageSkips).limit(10).sort({date: -1});
});


app.get('/vacancies/:vacancy_id', (req, res) => {
    let vacancyId = 0;
    if (req.params['vacancy_id']) {
        vacancyId = req.params['vacancy_id'];
        vacanciesModel.findOne({lastId: vacancyId}, function (err, vacancy) {
            if (err) return console.error(err);
            res.status(200).json(vacancy);
        });
    }
});


app.listen(3000, () => {
});

