const express = require("express");
const User = require("../models/user");
const auth=require('../middleware/auth')
const router = new express.Router();
const Task=require('../models/task')
const validator=require('validator')
const {sendWelcomeEmail,cancelationEmail,forgetEmail}=require('../emails/account')
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    sendWelcomeEmail(user.email,user.Name)
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token=await user.generateAuthToken()
    res.send({user,token});
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/users/me',auth,async(req,res)=>{
      res.send(req.user)
})

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logout',auth,async(req,res)=>{
 
  try{
    req.user.tokens=req.user.tokens.filter((token)=> token.token!==req.token)
   
     await req.user.save()
   
     res.status(200).send(req.user)
    
  }catch(e){
    
res.status(500).send()
  }
})

router.post('/forget',async(req,res)=>{
    email=req.body.email
    const user=await User.findOne({email})
    if(!user)
    return res.status(400).send("{error:'user not found'}")
    let math=Math.random()*9998
    if(math<1000)
    math+=1000
    forgetEmail(user.email,Math.ceil(math))
    user.otp=Math.ceil(math) 
    await user.save()
    res.status(200).send('we will sent you an otp on your email!')
})

router.post('/setnewpassword',async(req,res)=>{
  const email=req.body.email
  const otp=req.body.otp
  const user=await User.findOne({email,otp})
  if(!user)
  return res.status(400).send({error:'invalid otp'})
  user.otp=0
  user.password=req.body.newpassword
  await user.save()
  res.status(200).send('password updated successfully')
})





router.post('/users/logoutAll',auth,async(req,res)=>{
   try{
       req.user.tokens=[]
       await req.user.save()
       res.status(200).send()
   }catch(e){
     
       res.status(500).send()
   }
})



router.patch("/users/me", auth,async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["Name", "password", "age", "email"];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }

  try {
  
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
   
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth,async (req, res) => {
  try {
     
     await req.user.remove()
     cancelationEmail(req.user.email,req.user.Name)
     res.send();
  } catch (e) {
    res.sendStatus(500).send();
  }
});

module.exports = router;