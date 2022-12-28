const jwt = require('jsonwebtoken');
const User = require('../models/User');


// const auth = async req => {

//   console.log('hello')
//   try {
//     if (!req.headers.authorization) {
//       console.log(
//         'No authorization header found in request from ' )
//       return null;
//     }

//     const token =
//       (await jwt.decode(req.headers.authorization.split(' ')[1])) ||
//       req.headers.authorization;

//     if (!token) {
//       console.log('No token found in request from ' )
//       return null;
//     }
// console.log(token)
//     return token;
//   } catch (error) {
//     console.log(error)
//     return null;
//   }
// };


const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.SECRET)
    const user = await User.findOne({ _id: decoded._id })
    
    if (!user) {
      
      throw new Error()
    }
    
    req.token = token
    req.user = user
    next()

  } catch (e) {
    console.log(e)
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

module.exports = auth;
