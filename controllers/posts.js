const Posts = require('../models/Posts');
const Comments = require('../models/comments');
const User = require('../models/User');
const Likes = require('../models/likes');

// create posts

const createPost = async (req, res) => {


    try {
        const { title, description } = req.body;
        const user = await User.findById(req.user._id)

        if (!title) {
            console.log("Title Not found");
            return res
                .status(400)
                .json({ error: 'You must enter a title.' });
        }

        if (!description) {
            console.log("Description Not found");
            return res.status(400).json({ error: 'You must enter a description.' });
        }

        if (!user) {
            console.error("User Not found");
            return res
                .status(400)
                .json({ error: 'No user found for this email address.' });
        }

        const post = new Posts({
            title,
            description,
            userId: req.user._id,
            likes: [],
            comments: []
        })

        const newPost = await post.save()
        
        res.status(200).json(newPost);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }
}

// delete post 

const deletePost = async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (post) {
            if (post.userId.toString() === req.user._id.toString()) {
                await post.remove()
                res.json({ msg: 'Post removed' })
            }
            else {
                res.status(401).json({ msg: 'User not authorized' })
            }
        }
        else {
            res.status(404).json({ msg: 'Post not found' })
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }
}

// add comments 
const addComments = async (req,res)=>{
    try{
    // create comment
        console.log(req.body)
    const {text} = req.body;

    const user = await User.findById(req.user._id)
    const post = await Posts.findById(req.params.id)

    if(!user){
        console.error("User Not found");
        return res.status(400).json({error: 'No user found for this email address.'});
    }
        
    if(!post){
        console.error("Post Not found");
        return res.status(400).json({error: 'No post found for this id.'});
    }

    const comment = new Comments({
        comment: text,
        userId: req.user._id,
        postId: req.params.id
    })

    const result = await comment.save()
    console.log(result)
    res.status(200).json({id: result._id});

    

    }
    catch(err){
        // console.error("hello");
        console.error(err);
        res.status(500).json({msg: 'Server Error'});
    }
}



// add likes to likes model

const addLikes = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id)
        const post = await Posts.findById(req.params.id)

        if(!user){
            return res.status(400).json({error: 'No user found for this email address.'});
        }

        if(!post){
            return res.status(400).json({error: 'No post found for this id.'});
        }

        const like = new Likes({
            user: req.user._id,
            postId: req.params.id

        })


        const result = await like.save()

        res.status(200).json({id: result._id});
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }
}



const removeLikes = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id)
        const post = await Posts.findById(req.params.id)

        if(!user){
            return res.status(400).json({error: 'No user found for this email address.'});
        }
        
        if(!post){
            return res.status(400).json({error: 'No post found for this id.'});
        }

        const like = await Likes.findOne({user: req.user._id, postId: req.params.id})

        if(!like){
            return res.status(400).json({error: 'No like found for this user.'});
        }
        else{
            await like.remove()
            res.status(200).json({msg: 'Like removed'});
        }


    }
    catch(err){
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }   
}

//  // get post by id with comments and likes
const getPost = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id)
        const post = await Posts.findById(req.params.id)
        const comments = await Comments.find({postId: req.params.id})
        const likes = await Likes.find({postId: req.params.id})


        if(!user){
            return res.status(400).json({error: 'No user found for this email address.'});
        }
    
        if(!post){
            return res.status(400).json({error: 'No post found for this id.'});
        }

        res.status(200).json({_id: post._id, comments: comments, likes: likes.length,title: post.title, description: post.description, createdAt: post.createdAt});
    }  
    
    catch(err){
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }
}




const getAllPosts = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id)
        const posts = await Posts.find({user: req.user._id})

        // get comments and likes for each post
        const allposts = await Promise.all(posts.map(async (post)=>{
            const comments = await Comments.find({postId: post._id})
            const likes = await Likes.find({postId: post._id})
            return {_id: post._id, comments: comments, likes: likes.length,title: post.title, description: post.description, createdAt: post.createdAt}
        }))

        res.status(200).json(allposts);

        if(!user){
            return res.status(400).json({error: 'No user found for this email address.'});
        }

    }
    catch(err){
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }
}

module.exports = {
    createPost,
    deletePost,
    addComments,
    addLikes,
    removeLikes,
    getPost,
    getAllPosts,
}