const express = require('express');

const router = express.Router();

const { createCertificate, oneCertificate,allCertificates,deleteCertificate,updateCertificate,verifyUserExists,
        verifyCurseExists,assignPayment,verifyCompanyExists,generateInvoice } = require('../controllers/certificateController');

router.route('/').post(verifyUserExists,assignPayment,verifyCurseExists,
    verifyCompanyExists,generateInvoice,createCertificate).get(allCertificates);
router.route('/:id').patch(updateCertificate).get(oneCertificate).delete(deleteCertificate);

module.exports = router;