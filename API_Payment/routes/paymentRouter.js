const express = require('express');
const router = express.Router();

const { allPayments,createPayment,onePayment, updatePayment,deletePayment,verifyUserExists
        ,assignPlan } = require('../controllers/paymentController');

router.route('/').get(allPayments).post(verifyUserExists,assignPlan,createPayment);
router.route('/:id').get(onePayment).patch(updatePayment).delete(deletePayment);

module.exports = router;