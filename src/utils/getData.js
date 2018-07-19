let mongoose = require('mongoose');
const vacanciesSchema = require('../schemas/vacanciesSchema');
let vacanciesModel = mongoose.model('vacanciesModel', vacanciesSchema.vacanciesSchema);


module.exports = async function (req){
  let page;
  let pageSkips;
  let queryToDatabase = {};
  let arrayToSend = [];

  page = req.query.page || 1;

  pageSkips = (page - 1) * 10;
  if (req.query.salary === 'true') {
    queryToDatabase.salary = {};
    queryToDatabase = {'salary.currency': {$ne: null}};

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


  if (req.query.location && req.query.location != null) {
    queryToDatabase.location = 'Россия, ' + req.query.location;
  }

  await vacanciesModel.find(queryToDatabase, {
    "description": 0,
    "skills": 0
  }, function (err, vacancies) {
    if (err) return console.error(err);
    arrayToSend = vacancies;
  }).skip(pageSkips).limit(10).sort({date: -1});

  return arrayToSend;

};

