const express = require('express');
const router = express.Router();

const { allCourses,createCourse,oneCourse, updateCourse,deleteCourse,verifyUserExists } = require('../controllers/courseController');

router.route('/').get(allCourses).post(verifyUserExists,createCourse);
router.route('/:id').get(oneCourse).patch(updateCourse).delete(deleteCourse);

module.exports = router;