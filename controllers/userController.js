//const fs=require('fs');
//const users=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`,'utf-8'));

// exports.CheckUserId=(req,res,next)=>{
//   if(req.params.id>users.length){
//     return res.status(404).json({
//       status:'Fail',
//       message:"Invalid ID"
//     });
//   }
//   next();
// }
const User=require(`${__dirname}/../models/userModel`)
const {catchAsync}=require(`${__dirname}/../utils/catchAsync`);
const AppError=require(`${__dirname}/../utils/appError`);

exports. DeleteUser=catchAsync(async(req,res,next)=>{
   
   const deletedUser=await User.findByIdAndDelete(req.params.id)
    res.status(202).json({
      status:"Success",
      requestTime:req.requestTime,
      data:deletedUser
    })
    if (!deletedUser) {
      return  next(new AppError('Erorr user not found',404));
    }
   
    })
  
exports.getAllUsers=async(req,res) => {
  try{
  const users=await User.find().select('+password');
  res.status(200).json({
    status:"Success",
    Result:users.length,
    data:users
  })
}
catch(err){
  res.status(404).json({
    status:"fail",
    data:err
  })
}
}
  
 
  exports. UpdatedUser=(req,res)=>{
   
    
    
    res.status(200).res.json({
      status: 'success',
      requestedTime: req.requestTime,
      data:"<>USers is Updated<>"
    })
  }
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
  exports. AddUser =(req,res)=>{
    
   
  res.status(201).json({
    status:"success",
    results: users.length,
    requestedTime: req.requestTime,
    data:users
  })
  };