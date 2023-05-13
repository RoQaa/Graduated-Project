const cloudinary=require('./cloudaniry');
uploadImage=(async(imagePath)=>{
    const options = {
      use_filename: false,
      unique_filename: false,
      overwrite: false,
    };
    try{
    const result=await cloudinary.uploader.upload(imagePath,options);
    return result.url;
    }
    catch(err){
      console.log(err);
    }
    })

module.exports=uploadImage;