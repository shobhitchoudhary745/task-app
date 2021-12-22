const mongoose=require('mongoose')
const userSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    defaule: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});


const Task = mongoose.model("tasks", userSchema);

  module.exports=Task