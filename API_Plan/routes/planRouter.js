const express = require('express');

const router = express.Router();


const { allPlans,createPlan,onePlan, updatePlan,deletePlan,verifyUserExists, authenticateAdmin } = require('../controllers/planController');

router.route('/').get(allPlans).post(authenticateAdmin,verifyUserExists,createPlan);
router.route('/:id').get(onePlan).patch(updatePlan).delete(deletePlan);

module.exports = router;