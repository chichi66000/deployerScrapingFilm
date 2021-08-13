const express = require('express');
const router = express.Router();
const filmCtrl = require('../controllers/scrapingfilm')

router.get('/:dateChoosen', filmCtrl.scrapingfilm)

module.exports = router;