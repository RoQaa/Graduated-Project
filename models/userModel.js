//email username passorwd passowrd confirm
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Must has a username'],
       // maxlength:[25,'username maxiumm is 25 letters'],
      //  minlength:[10,'username atleast has 10 letters']
    },
    password:{
        type:String,
        required:[true,'Must has a Password'],
        trim:true,
        minlength:[8,'At least has 8 charachters'],
        select:false // make it invisible when get all users 
        },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el) {
              return el === this.password;
            },
            message: 'Passwords are not the same!'
          },
  
    },
    email:{
        type:String,
        required:[true,'user must has a email Addresse'],
        unique:true,
        lowercase:true,
        //trim:true,
        validate:[validator.isEmail,'please provide email']
    },
    photo:String,
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false// mby5li4 3l this ya4ta8l
    },
    passwordChangedAt:Date
    

})
userSchema.pre('save',async function(next){
    //only run if password modified
    if(!this.isModified('password')){
        return next();
    }
    //hash password
    this.password= await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
})
//instance method
userSchema.methods.correctPassword= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)// compare bt3mal hash le candidate we btcompare b3deha
}
userSchema.methods.changesPasswordAfter=function(JWTTimestamps){
   
    if(this.passwordChangedAt){
        const changedTimestamps=parseInt(this.passwordChangedAt.getTime()/1000,10);
        //console.log(changedTimestamps,JWTTimestamps);
        return JWTTimestamps < changedTimestamps;
    }
    return false;
}
userSchema.methods.createPasswordRestToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
const User=mongoose.model('User',userSchema);
module.exports=User;