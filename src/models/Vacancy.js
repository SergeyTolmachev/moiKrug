let mongoose = require('mongoose');
const vacanciesSchema = require('../schemas/vacanciesSchema');
let vacanciesModel = mongoose.model('vacanciesModel', vacanciesSchema.vacanciesSchema);



class Vacancy {
  async getData(req){
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
  }

  async getVacancy(req){
    let vacancyId = 0;
    let vacancyToSend = {};
    let success = false;
    if (req.params['vacancy_id']) {
      vacancyId = req.params['vacancy_id'];
      await vacanciesModel.findOne({lastId: vacancyId}, function (err, vacancy) {
        if (err) {
          return console.error(err);
        }
        if (vacancy != null){
          success = true;
          vacancyToSend = vacancy;
        }
      });
    }
    if (success === false){
      return false;
    } else {
      return vacancyToSend;
    }
  }
}


module.exports = new Vacancy();
