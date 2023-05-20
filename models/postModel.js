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
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

postSchema.virtual('Date').get(function(){
   let date=this._id.getTimestamp();
   date=date.toString();
  return date.substring(4,15);
}); 
postSchema.virtual('Time').get(function(){
    let date=this._id.getTimestamp();
    date=date.toString();
   return date.substring(16,21);
 }); 
postSchema.pre(/^find/,function(next){//populting by ref
     
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