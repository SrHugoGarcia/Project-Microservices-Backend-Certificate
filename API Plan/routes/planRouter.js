const express = require('express');

const router = express.Router();


const { allPlans,createPlan,onePlan, updatePlan,deletePlan,verifyUserExists } = require('../controllers/planController');

router.route('/').get(allPlans).post(verifyUserExists,createPlan);
router.route('/:id').get(onePlan).patch(updatePlan).delete(deletePlan);

module.exports = router;