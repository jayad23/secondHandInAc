const express = require('express');
const { body } = require('express-validator');
// Controllers
const {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actors.controller');

// Middlewares
const {
  validateSession,
  protectAdmin
} = require('../middlewares/auth.middleware');
const { actorExists } = require('../middlewares/actors.middleware');

// Utils
const { upload } = require('../util/multer');

const router = express.Router();

router.use(validateSession);

router
  .route('/')
  .get(getAllActors)
  .post(
    protectAdmin, 
    upload.single('img'),
    [
      body('name')
        .isString()
        .notEmpty(),
      body('country')
        .isString()
        .notEmpty()
        .withMessage('Must provide a country'),
      body('rating')
        .isNumeric()
        .withMessage('Rating must be a number')
        .custom((value)=> value > 0 && value <= 5)
        .withMessage('rating must be given from 1 up to 5'),
      body('age')
        .isNumeric()
        .custom((age)=> age > 0)
    ],
    createActor
  );

router
  .use('/:id', actorExists)
  .route('/:id')
  .get(getActorById)
  .patch(protectAdmin, updateActor)
  .delete(protectAdmin, deleteActor);

module.exports = { actorsRouter: router };