const mongoose =require('mongoose');
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        minlength:[8,'At least 8 letters'],
        
    }
})