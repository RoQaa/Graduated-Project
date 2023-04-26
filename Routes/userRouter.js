const express=require('express');
const {getAllUsers,AddUser,GetUser,UpdatedUser,DeleteUser,deletedMe}=require(`${__dirname}/../controllers/userController`);
const authController=require(`${__dirname}/../controllers/authController`);
const router=express.Router();


router.post('/signUp',authController.SignUp);
router.post('/login',authController.login);
router.post('/forgotpassword',authController.forgotPassword);
router.post('/CheckEmailOrPassword',authController.protect,authController.CheckEmailOrPassword);
router.post('/verifyEmailOtp',authController.protect,authController.verifyEmailOtp);
router.post('/verifyPhoneOtp',authController.protect,authController.verifyPhoneOtp);
router.post('/logout',authController.protect,authController.logOut);
router.patch('/resetpassword',authController.protect,authController.resetPassword);
router.patch('/updatePassword',authController.protect,authController.updatePassword);
router.patch('/updateUser',authController.protect,UpdatedUser);
router.delete('/DeleteMe',authController.protect,deletedMe);
 
router.route('/')
  .get(getAllUsers)
  .post(AddUser);
 
 
 
  router.route('/:id')
  .get(GetUser)
  .patch(UpdatedUser)
  .delete(DeleteUser);
  module.exports=router;