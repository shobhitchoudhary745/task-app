const jwt=require('jsonwebtoken')
const User=require('../models/user')
const auth=async(req,res,next)=>{
   
    try {
      const token = req.header("Authorization");
      const decoded = await jwt.verify(token,process.env.CHECKER);
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });

      if (!user) {
        throw new Error("user not found");
      }
      req.token = token;
      req.user = user;
      next();
    } catch (e) {
      res.status(401).send({ error: "please authenticate" });
    }

}
module.exports=auth
