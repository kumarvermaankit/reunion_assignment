

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

const tokenLife = process.env.TOKEN_LIFE;

const authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: 'No user found for this email address.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Password Incorrect'
      });
    }

    const payload = {
      _id: user._id
    };

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    if (!token) {
      throw new Error();
    }

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
});
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
}

// register a user
const register = async (req, res) => {

const { username, email, password } = req.body;

if (!username) {
  return res
    .status(400)
    .json({ error: 'You must enter a username.' });
}

if (!email) {
  return res
    .status(400)
    .json({ error: 'You must enter an email address.' });
}

if (!password) {
  return res.status(400).json({ error: 'You must enter a password.' });
}

const user = await User.findOne({email:email})

if(user){
  return res.status(400).json({ error: 'User already exists.' });
}
else{
  const newUser = new User({
    username:username,
    email: email,
    password: password,
    following: [],
    followers: []
  })

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);

  await newUser.save()

 res.status(200).json({newuser:newUser})
}


}

module.exports = {
  authenticate,
  register
}
