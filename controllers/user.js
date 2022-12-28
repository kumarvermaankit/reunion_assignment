const User = require('../models/User');



const getUserProfile = async (req, res) => {
    console.log(req.user._id)
    try {
        const user = await User.findById(req.user._id)
        if(user){
            res.status(200).json({username:user.username ,followers:user.followers.length,following:user.following.length})

        }
        else{
            console.error("User Not found");
            res.status(400).json({msg: 'User Not found'});

        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }
}

const follow = async (req, res) => {
    console.log(req.params)
    try {
        const user = await User.findById(req.user._id)
        const userFollow = await User.findById(req.params.id)
        if(user && userFollow){
            if(user.following.includes(req.params.id)){
                res.status(400).json({msg: 'Already Following'});
            }
            else{
                user.following.push(req.params.id)
                userFollow.followers.push(req.user._id)
                await user.save()
                await userFollow.save()
                res.status(200).json({msg: 'Followed'});
            }
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }
}

const unfollow = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const userUnfollow = await User.findById(req.params.id)
        if(user && userUnfollow){
            if(user.following.includes(req.params.id)){
                user.following.pull(req.params.id)
                userUnfollow.followers.pull(req.user._id)
                await user.save()
                await userUnfollow.save()
                res.status(200).json({msg: 'Unfollowed'});
            }
            else{
                res.status(400).json({msg: 'Not Following'});
            }
        }
}
    catch(err){
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }        
}




module.exports = {
    getUserProfile,
    follow,
    unfollow
}