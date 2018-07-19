let mongoose = require('mongoose');
const vacanciesSchema = require('../schemas/vacanciesSchema');
let vacanciesModel = mongoose.model('vacanciesModel', vacanciesSchema.vacanciesSchema);


module.exports = async (req) =>{
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
};
