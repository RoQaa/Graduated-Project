const express=require('express');
const router=express.Router();
const postController=require('../controllers/postController');

router.post('/add',postController.addPost);
router.get('/all',postController.getPosts);
router.route('/delete/:id').delete(postController.deletePost)
module.exports=router;