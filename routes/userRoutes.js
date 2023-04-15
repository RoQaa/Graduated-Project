const express=require('express');
const {getAllUsers,AddUser,GetUser,UpdatedUser,DeleteUser}=require(`${__dirname}/../controllers/userController`);
const authController=require(`${__dirname}/../controllers/authController`);
const router=express.Router();


router.post('/signUp',authController.SignUp);
router.post('/login',authController.login);
router.post('/forgetpassword',authController.forgotPassword);
router.post('/restpassword',authController.restPassword);
 
router.route('/')
  .get(getAllUsers)
  .post(AddUser);
 
 
 
  router.route('/:id')
  .get(GetUser)
  .patch(UpdatedUser)
  .delete(DeleteUser);
  module.exports=router;