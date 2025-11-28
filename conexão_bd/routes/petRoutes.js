const express = require('express');
const router = express.Router();
const petController = require('../controllers/petControllers');


router.get('/', petController.getAllPets);


router.post('/', petController.createPet);


router.delete('/:id', petController.deletePet);

module.exports = router;