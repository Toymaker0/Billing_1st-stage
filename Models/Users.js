const mongoose=require('mongoose')


const userSchama=new mongoose.Schema({
    userName:String,
    password:String,
    rights:Array
})

const userModel=mongoose.model('Users',userSchama)

module.exports=userModel
