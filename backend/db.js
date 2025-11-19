const mongooes = require("mongoose")

mongooes.connect("mongodb+srv://admin1:Tonystark333@cluster0.d9rzv.mongodb.net/Paytm?retryWrites=true&w=majority&appName=Cluster0")

const userSchema = mongooes.Schema({
    username:{
        type:String,
        requried:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:30,
    },
    firstname:{
        type:String,
        required:true,
        trim:true,
        maxlength:50,
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        maxlength:50,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },

})

const accountSchema = new mongooes.Schema({
    userId:{
        type:mongooes.Schema.Types.ObjectId,//reference to user model,
        ref:'User',
        requried:true,
    },
    balance:{
        type:Number,
        required:true,
    }
}) 

const User = mongooes.model("User", userSchema);
const Account = mongooes.model("Account", accountSchema)

module.exports = {User, Account};