const User = require('../models/User');

const {deleteOne, updateOne, getOne, getAll, createOne} = require('../controllers/handleFactory')

const getMe = (req,res,next)=>{
    req.params.id = req.user.id;
    next();
}

const createUser=createOne(User);

const allUsers = getAll(User);

const oneUser = getOne(User);

const updateUser = updateOne(User);

const deleteUser = deleteOne(User);

module.exports = {createUser, oneUser,allUsers,deleteUser,updateUser, getMe};