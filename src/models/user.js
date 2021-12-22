const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt=require('jsonwebtoken')
const Task=require('./task')
const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: String,
    required:true,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("age must be positive");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("password can not contain password");
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]

});
 
userSchema.virtual('tasks',{
  ref:'tasks',
  localField:'_id',
  foreignField:'owner'
})

userSchema.methods.generateAuthToken=async function (){
  const user = this
  const token= await jwt.sign({_id:user._id.toString()},'shobhitchoudhary')
  user.tokens=user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({error:"unable to login"});
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error({error:"unable to login"});
  }
  return user;
};
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre('remove',async function (next){
  const user=this
  await Task.deleteMany({owner:user._id})
  next()
} )

const User = mongoose.model("users", userSchema);

module.exports = User;
