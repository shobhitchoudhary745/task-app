const sg=require('@sendgrid/mail')
const api=process.env.API
sg.setApiKey(api)

const sendWelcomeEmail=(email,name)=>{
    sg.send({
        to:email,
        from:'shobhitchoudhary745@gmail.com',
        subject:'Thanks for joining todo-app',
        text:`Welcome to the app ${name}. Let me know how you get along with this app`
     }) 
}

const cancelationEmail=(email,name)=>{
    sg.send({
        to:email,
        from:'shobhitchoudhary745@gmail.com',
        subject:'sorry to see you go!',
        text:`Goodbye, ${name}. I hope to see you back soon`
     }) 
}

const forgetEmail=(email,math)=>{
    sg.send({
        to:email,
        from:'shobhitchoudhary745@gmail.com',
        subject:'forget password!',
        text:`Your one time otp is ${math}`
     }) 
}

module.exports={
    sendWelcomeEmail,
    cancelationEmail,
    forgetEmail
}

