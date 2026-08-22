const express = require('express');
const router = express.Router();
const { getAllFaculty, addFacultyProfile, removeFacultyProfile } = require('../controllers/facultyController');

router.route('/').get(getAllFaculty).post(addFacultyProfile);
router.route('/:id').delete(removeFacultyProfile);

module.exports = router;