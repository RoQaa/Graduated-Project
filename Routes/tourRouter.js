const express=require('express');
const router=express.Router();
const tourController=require(`${__dirname}/../Controllers/tourController`);
const authController=require(`${__dirname}/../Controllers/authController`);

//  router.param('id',tourController.checkId);
router.route('/stats-Tours').get(tourController.getTourStats);
router.route('/monthly-Plan/:year').get(tourController.getMonthlyPlan);
router.route('/top-5-Tours')
.get(tourController.aliasTop5,tourController.GetAllTours)
  router.route('/')
  .get(authController.protect,tourController.GetAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.GetTour)
  .patch(tourController.UpdateTour)
  .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.DeleteTour);
  module.exports=router;