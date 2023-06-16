const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauces);

module.exports = router;