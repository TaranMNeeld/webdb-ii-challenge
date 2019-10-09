const express = require('express');

const carDb = require('./cars-model.js');

const router = express.Router();

router.post('/', validateCar, (req, res) => {
    const carData = req.body;
    carDb.insert(carData)
        .then(car => {
            res.status(201).json(car);
        })
        .catch(err => {
            res.status(500).json({ message: "failed to post car to the database" });
        });
});

router.get('/', (req, res) => {
    carDb.get()
        .then(cars => {
            res.status(200).json(cars);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to get cars from the database" });
        });
});

router.get('/limit/:id', (req, res) => {
    const id = req.params.id;
    carDb.get().limit(id)
        .then(cars => {
            res.status(200).json(cars);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to get cars from the database" });
        });
});

router.get('/:id', validateCarId, (req, res) => {
    const id = req.params.id;
    carDb.getById(id)
        .then(car => {
            res.status(200).json(car);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to get car from the database" });
        });
});

router.delete('/:id', validateCarId, (req, res) => {
    const id = req.params.id;
    carDb.remove(id)
        .then(car => {
            res.status(200).json(car);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to remove car from the database" });
        });
});

router.put('/:id', validateCarId, validateCar, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    carDb.update(id, changes)
        .then(car => {
            res.status(200).json(car);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to update car in the database" });
        });
});

//custom middleware

function validateCarId(req, res, next) {
    const id = req.params.id;
    carDb.getById(id)
        .then(car => {
            if (id) {
                req.car = car;
            } else {
                res.status(400).json({ message: "invalid car id" });
            }
        })
    next();
};

function validateCar(req, res, next) {
    const carData = req.body;
    if (!carData.name) {
        res.status(400).json({ errorMessage: "missing required name field" });
    } else if (!carData.year) {
        res.status(400).json({ errorMessage: "missing required year field" });
    } else if (!carData.make) {
        res.status(400).json({ errorMessage: "missing required make field" });
    } else if (!carData.model) {
        res.status(400).json({ errorMessage: "missing required model field" });
    }else {
        console.log('car validated');
        next();
    }
};

module.exports = router;
