const User = require('../Models/userModel')
const APIFeatures = require('./../utils/apiFeatures')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.getAllUser = catchAsync( async (req, res, next) => {

    const users = await User.find() //EXECUTE data
  
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      },
    });
  })
  exports.GetUser=catchAsync(async (req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
      return next(new AppError("user not found",404));
    }
    res.status(200).json({
      status:"success",
      data:{
        user:user
      }
    })
  })
  