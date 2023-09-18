const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const Loan= require('./../model/loans');
    
// MODEL
const userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: [true, 'Please tell us your fullname!']
    },     
    lastname: {
        type: String
    },
    email:String,
    password: {
        type: String,
    },    
    role: {
        type: String,
        default: 'customer'
    },
    loan: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan"
    }],
});
 
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model('loanUsers', userSchema);

module.exports=User;
