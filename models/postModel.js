const mongoose=require('mongoose');
const validator =require('validator');
const postSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId, //population data
        ref:'User',
        required:[true,"create post must has user to post"]
    },
    description:{
        type:String,
    },
    image:String,
   
},{
    timestamps:true
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