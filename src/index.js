const express = require("express");
require("./db/mongoose");
const app = express();
const cors=require('cors')

app.use(cors())
   


const userRouter=require('./routers/user')
const taskrouter=require('./routers/task')
app.use(express.json());
app.use(userRouter)
app.use(taskrouter)
const port = process.env.PORT || 4000;
app.listen(port,()=>{
   console.log('server is upon port '+port)
})
