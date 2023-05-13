const mongoose=require('mongoose');
const validator =require('validator');
const postSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId, //population data
        ref:'User'
    },
    description:{
        type:String,
    },
    image:String,
   
})
postSchema.pre(/^find/,function(next){ //populting by ref
    this.populate(
        {
            path:'user',
             select:'name photo'
        }
    );
    next();
})
const Post=mongoose.model('Post',postSchema);

module.exports=Post;