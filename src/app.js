const express = require('express');
const bodyParser = require('body-parser');
let mongoose = require('mongoose');
const vacanciesSchema = require('./src/schemas/vacanciesSchema');
const db = require('./src/config/mongodbConnect');


let vacanciesModel = mongoose.model('vacanciesModel', vacanciesSchema.vacanciesSchema);


const app = express();


app.use(bodyParser.urlencoded({extended: true}));


app.get('/vacancies/', (req, res) => {
    let page;
    let pageSkips;
    let queryToDatabase = {};


    if (req.query.page) {
        page = req.query.page;
    } else {
        page = 1;
    }

    pageSkips = (page - 1) * 10;

    if (req.query.remote == 'false') {
        queryToDatabase.remote = false;
    }

    if (req.query.remote == 'true') {
        queryToDatabase.remote = true;
    }


    if (req.query.fullDay == 'false') {
        queryToDatabase.fullDay = false;
    }

    if (req.query.fullDay == 'true') {
        queryToDatabase.fullDay = true;
    }


    if (req.query.location) {
        queryToDatabase.location = 'Россия, ' + req.query.location;
    }

    console.log(JSON.stringify(queryToDatabase, null, 4));

    vacanciesModel.find(queryToDatabase, {"description": 0, "skills": 0}, function (err, vacancies) {
        if (err) return console.error(err);
        //console.log(vacancies);
        res.status(200).json(vacancies);
    }).skip(pageSkips).limit(10).sort({date: -1});
});

//lastId - номер последней отданной вакансии
//remote - возможность удаленной работы
//location - местоположение
//fullDay - необходимость полного рабочего дня


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
    console.log('We are live on ' + 3000);
});

