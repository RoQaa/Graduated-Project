const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const {promisify}=require('util');
const User =require('../models/userModel');
const {catchAsync}=require('../utils/catchAsync');
const AppError=require('../utils/appError');
const sendEmail=require('../utils/email');
 
const signToken= (id)=>{
    const token=jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })  //sign(payload,secret,options=expires)
    return token;
    
}


const createSendToken=(user,statusCode,res)=>{
const token =signToken(user.id);

const cookieOption={
  expires:new Date (Date.now()+(process.env.JWT_COOKIE_EXPIRES_IN) *24*60*60*1000), //=> 90 days
  httpOnly:true // be in http only
}

if(process.env.NODE_ENV==='production') cookieOption.secure=true // client cann't access it

res.cookie('jwt',token,cookieOption); // save jwt in cookie

//Remove password from output
user.password=undefined;


res.status(statusCode).json({
    status:"success",
    token,
    data:{
      user
    }
})

}


exports.SignUp=catchAsync(async(req,res,next)=>{
const newUser=await User.create({  //create()  and save() doc
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm,
   // passwordChangedAt:req.body.passwordChangedAt,
    role:req.body.role
});

if(!newUser){
  return next(new AppError(`Cannot Sign Up`,404) );
 }
 
//generate server token 
// const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
//     expiresIn:process.env.JWT_EXPIRES_IN
// })  //sign(payload,secret,options=expires)

createSendToken(newUser,201,res);
// const token=signToken(newUser._id);

// res.status(201).json({
//     status:"success",
//     token:token,
//     data:newUser
// });

});

exports.login=catchAsync(async(req,res,next)=>{
 const {email,password}=req.body;

//1) check email && password exist,
if(!email||!password){
    return next(new AppError("please provide email & password",400));
}
//2)check user exists && password is correct
const user = await User.findOne({email:email}).select('+password'); // hyzaod el password el m5fee aslan

//const correct=await user.correctPassword(password,user.password);

if(!user||!(await user.correctPassword(password,user.password) /** 34an hyrun fe el correct 7ta loo ml2hoo4*/)){
    return next(new AppError("Incorrect email or password",401));
}
//3) if everything ok send token back to the client
  
  createSendToken(user,200,res);
// const token=signToken(user._id);

// res.status(200).json({
//     status:"success",
//     token:token
// })

})
//MIDDLEWARE CHECK IF USER STILL LOGGED IN
exports.protect=catchAsync(async(req,res,next)=>{
    //1)Getting token and check it's there
let token;
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1];
}
if(!token){
    return next(new AppError("Your're not logged in please log in",401)) //401 => is not 'authorized
}
    //2)Verification token
  const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
   
    //3)check if user still exist in the route
    const currentUser=await User.findById(decoded.id);
    if(!currentUser){
        return next(
            new AppError(`user belonging to this token doesn't exist`
            ,401)
            )
        }
    //4)check if user changed password after the token has issued
   if( currentUser.changesPasswordAfter(decoded.iat)){ //iat=> issued at
    return next(new AppError("user has changed password recently please log in again",401))
   } 
   //GRANT ACCESS TO PROTECTED ROUTE
   req.user=currentUser; // pyasse el data le middleware tany
next();

})
exports.restrictTo=(...roles)=>{ //function feha paramter we 3awz a7oot feha middleware
    //roles ['admin','lead-guide']
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError("You do not have permission to preform this action",403))
        }
        next();
    }

}
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
  
    // 2) Generate the random reset token
    const resetToken = user.createPasswordRestToken();
    const otp=Math.floor(Math.random()*90000) + 10000;
    await user.save({ validateBeforeSave: false });
  
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
  
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: 
    ${resetURL}.
    \nIf you didn't forget your password, please ignore this email!
    the otb is ${otp}`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  });
exports.resetPassword=catchAsync(async(req,res,next)=>{
  // 1-GET USER BASED ON TOKEN
const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
const user = await User.findOne({
  passwordResetToken:hashedToken,
  passwordResetExpires:{$gt:Date.now()}
});

//2-if token isn't expires and there's user set new password
if(!user){
  return next(new AppError("Token is invalid or has expired",400))
}
user.password=req.body.password;
user.passwordConfirm=req.body.passwordConfirm;
user.passwordResetExpires=undefined;
user.passwordResetToken=undefined;
await user.save({validateBeforeSave:false});
//3-
 //4-
// const token = signToken(user._id);
// res.status(200).json({
//   status:'success',
//   token
// })
    createSendToken(user,200,res);
    
})

exports.updatePassword=catchAsync(async(req,res,next)=>{ //settings  hy48lha b3d el protect
  // 1) Get user from collection 

        const user =await User.findById(req.user.id).select('+password')
        
        if(!user){
          return next(new AppError(" there's no user with that token",404))
        }
  // 2) Check if posted current password is correct
        if(!(await user.correctPassword(req.body.currentPassword,user.password))){
          return next(new AppError("Current password isn't correct",400))
        }
     

  // 3) If so, update password 
        user.password=req.body.newPassword
        user.passwordConfirm=req.body.newPasswordConfirm
   
        await user.save({validateBeforeSave:false})
  // 4) Log user in, send JWT
  createSendToken(user, 200, res);

})




