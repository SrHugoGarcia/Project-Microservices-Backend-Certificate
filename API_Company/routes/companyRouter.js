const express = require('express');
const router = express.Router();
const { createCompany, oneCompany,allCompanys,deleteCompany,updateCompany,verifyUserExists } = require('../controllers/companyController');

router.route('/').post(verifyUserExists,createCompany).get(allCompanys);
router.route('/:id').patch(updateCompany).get(oneCompany).delete(deleteCompany);

module.exports = router;