const router = require('express').Router();

const userController = require('../controllers/user');
const postController = require('../controllers/posts');
const authenticate = require('../controllers/authentication');

const auth = require('../middleware/auth');
router.post('/register',authenticate.register);
router.post('/authenticate',authenticate.authenticate);
router.post("/follow/:id", auth, userController.follow)
router.post("/unfollow/:id", auth, userController.unfollow)
router.get("/user", auth, userController.getUserProfile)
router.post("/posts",auth, postController.createPost)
router.delete("/posts/:id",auth, postController.deletePost)
router.post("/like/:id",auth, postController.addLikes)
router.post("/unlike/:id",auth, postController.removeLikes)
router.post("/comment/:id",auth, postController.addComments)
router.get("/posts/:id",auth, postController.getPost)
router.get("/all_posts",auth, postController.getAllPosts)

module.exports = router;