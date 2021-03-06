const numCPUs = require('os').cpus().length;
const cluster = require('cluster');
const db = require('./config/mongodbConnect');
const express = require('express');
const bodyParser = require('body-parser');
const vacancyModel = require('./models/Vacancy');

if (cluster.isMaster) {
    cluster.on('disconnect', (worker, code, signal) => {
        console.log(`Worker ${worker.id} died`);
        cluster.fork();
    });

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.id} running`);
    });
    for (let i = 0; i < numCPUs; ++i) {
        cluster.fork();
    }
} else {
    const app = express();

    app.use(bodyParser.urlencoded({extended: true}));

    console.log('hello from worker #' + process.pid);


    app.get('/vacancies/', async (req, res) => {
        let vacancies = await vacancyModel.getData(req);
        console.log(vacancies);
        res.status(200).json(vacancies);
    });


    app.get('/vacancies/:vacancy_id', async (req, res) => {
        let vacancy = await vacancyModel.getVacancy(req);
        console.log(vacancy);
        if (vacancy){
            res.status(200).json(vacancy);
        } else {
            res.status(404).send('страница вакансии не найдена');
        }
    });


    app.listen(3000, () => {
    });
}







