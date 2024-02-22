const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const userModel=require('./Models/Users')
const jwt =require('jsonwebtoken')
const cookie_parser=require('cookie-parser')



const app=express()
app.use(cors(
   {
      origin:['http://localhost:3000'],credentials:true
   }
))
app.use(express.json())
app.use(cookie_parser())
mongoose.connect('mongodb://localhost:27017/Billing')



app.post('/addUser',async(req,res)=>{
 try {

    await userModel.create(req.body)
   
 } catch (error) {
    console.log(error,'error in /addUser');
 }
})
app.get('/getUserAll',async(req,res)=>{
     let response= await userModel.find()
        res.json(response)
})
app.get('/getUser/:id',async(req,res)=>{
   const id=req.params.id
const user=await  userModel.findById({_id:id})
res.json(user)
})
app.post('/updateUser/:id',async(req,res)=>{
   const _id=req.params.id
   let user=req.body
   console.log(req.body);
  await userModel.findByIdAndUpdate(_id,user)
})
app.post('/removeUser/:id',async(req,res)=>{
   const _id=req.params.id
   await userModel.findByIdAndDelete(_id)
})
//////////////////////////login///////////////-
app.post('/login',async(req,res)=>{
  const user = await userModel.findOne({"userName":req.body.username})
//   console.log(user);
  if (user) {
   if(user.password==req.body.password){
      const refreshToken=jwt.sign({user},"refresh-key",{expiresIn:'60m'})
      res.cookie('session',refreshToken)
      return res.json({Login:true,user})
   }
   else{
      res.json('password incorrect')
   }

}
  else{
   res.json('no Records')
   console.log('no');
  }
})

////////////////verify///////////
const verifyUser= (req,res,next)=>{
   const session=req.cookies.session
   let user
   jwt.verify(session,'refresh-key',(err,decode)=>{
     if(decode){
      user=decode.userName
     next()
     }
   })
 

}

//////////////autherization ////////////////
app.get('/auth',verifyUser,(req,res)=>{
  res.json('Authurized')
})
//  app.get('/getme',(req,res)=>{
//    let userDetails
//   const jwtLink=req.cookies.session
//   jwt.verify(jwtLink,'refresh-key',(err,decode)=>{
//    if(decode){
//       console.log(decode);
//       userDetails=decode
//    }
//  })
//  res.json(userDetails)
// })


app.get('/removeSession',(req,res)=>{
   return res.cookie('session','').json({success:"true",message:"logout"})
})

app.get('/getSession',(req,res)=>{
  const session= req.cookies.session
  res.json(session)
})

app.use(express.static(path.join(__dirname,'build')))
app.get('/',(req,res)=>{
    res.sendFile(require('path').join(__dirname,"build","index.html"))
})

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


app.listen(8055,(req,res)=>{
    console.log("server is running");
})
