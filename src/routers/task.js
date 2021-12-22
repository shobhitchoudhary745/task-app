const express=require('express')
const Task=require('../models/task')
const router=new express.Router()
const auth=require('../middleware/auth')

router.post("/tasks",auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});
  
 router.get("/tasks", async (req, res) => {
    try {
      const tasks = await Task.find({});
  
      res.send(tasks);
    } catch (e) {
      res.status(500).send();
    }
  });
  
  router.get("/tasks/me",auth, async (req, res) => {
    //const _id=req.params.id
    try {
      
       Task.find({owner:req.user._id}).then(task=>{
        // console.log(task)
         res.send(task)
       })
      
    } catch (e) {
      res.status(500).send()
    }
  });
  
  router.post("/taasks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) =>allowUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid updates" });
    }
  
    try {
      const task = await Task.findById(req.params.id);
      updates.forEach(update=>task[update]=req.body[update])
      await task.save()
      if (!task) {
        return res.status(404).send();
      }
      res.send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  
  router.delete("/tasks/:id", async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.send(404).send();
      }
      res.send(task);
    } catch (e) {
      res.sendStatus(500).send();
    }
  });
  
  module.exports=router