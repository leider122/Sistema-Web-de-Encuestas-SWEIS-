const express = require('express');
const router = express.Router();

const estadisticasController = require('../controllers/estadisticasController');

router.get('/:id', estadisticasController.mos)

module.exports = router;