const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getAllSauces);

module.exports = router;