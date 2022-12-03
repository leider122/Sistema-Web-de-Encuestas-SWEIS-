const express = require('express');
const router = express.Router();

const poblacionController = require('../controllers/poblacionController');

router.get('/', poblacionController.list)
router.post('/add', poblacionController.save)
router.post('/edit', poblacionController.edit)
router.get('/deleteT', poblacionController.deleteT)
router.post('/cons', poblacionController.consulta)
module.exports = router;