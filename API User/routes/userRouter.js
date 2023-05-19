const express = require('express');

const {createUser,allUsers,oneUser,updateUser,deleteUser, getMe } = require('../controllers/userController')
const {register,login, protect , signOff,updatePassword } = require('../controllers/authController');
const router = express.Router();

//Autenticacion
router.route('/registration').post(register);
router.route('/login').post(login)
router.route('/sign-off').get(signOff)

router.use(protect)
router.route('/update-my-Password').patch(updatePassword);
//Rutas para usuarios
router.route('/me').get(getMe,oneUser);
router.route('/').get(allUsers).post(createUser);
router.route('/:id').get(oneUser).patch(updateUser).delete(deleteUser);

module.exports = router;