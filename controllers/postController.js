const Post=require('./../models/postModel');
const {catchAsync}=require(`${__dirname}/../utils/catchAsync`);
const AppError=require(`../utils/appError`);

exports.addPost=catchAsync(async (req,res,next) => {
  const newPost= await Post.create(req.body);
  res.status(200).json({
    status:true,
    message:"Post Created Sucessfully",
    data:newPost
  })
})

exports.getPosts=catchAsync(async (req,res,next) => {
    const allPosts= await Post.find();
    if(!allPosts){
        return next(new AppError("there's no posts to Get ",404))
    }
    res.status(200).json({
        status:true,
        message:"AllPosts",
        data:allPosts
    })
  
})

exports.deletePost=catchAsync(async(req,res,next)=>{
    const deletePost=await Post.findByIdAndDelete(req.params.id);
    console.log(req.params.id);
    if (!deletePost) {
        return next(new AppError('No post found with that ID', 404));
      }
    res.status(204).json({
        status:true,
        message:"Deleted sucessfully",
        data:null
    })
})