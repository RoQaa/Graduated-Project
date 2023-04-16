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
const User=require(`${__dirname}/../models/userModel`);
const {catchAsync}=require(`${__dirname}/../utils/catchAsync`);
const AppError=require(`${__dirname}/../utils/appError`);


const filterObj=(obj,...allowedFields)=>{
  const newObj={};
  Object.keys(obj).forEach(el=>{
      if(allowedFields.includes(el)) newObj[el]=obj[el]
  });
  return newObj;
}
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
  
 
  exports.UpdatedUser=catchAsync(async(req,res,next)=>{
    
    if(req.body.password||req.body.passwordConfirm){
      return next(
        new AppError
        ("Password not provided here in that route please go to update password route"
        ,400)
        )
    }

   const filterBody=filterObj(req.body,'name','email')
    const updatedUser= await User.findByIdAndUpdate(req.user.id,filterBody
      ,{
        new:true,
        runValidators:true
      })
    res.status(200).json({
      status:"success",
      user:updatedUser
    })
   
  })

exports.deletedMe=catchAsync(async (req,res,next) => {
  await User.findByIdAndUpdate(req.user.id,{active:false},{
    new:true,
    runValidators:true
  })

  res.status(204).json({
    status:"success",
    data:null
  })
  
}
  )





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