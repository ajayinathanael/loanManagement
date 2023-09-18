 
const mongoose = require('mongoose');
 
// MODEL
const loanSchema = new mongoose.Schema({
      
    address: {
        type: String
    },
    dob: {
        type: String
    },
    reason: String,
    photos: {
        type: String
    },
    status: {
        type: String,
        default: 'PENDING'
    }
});
 
const Loan = mongoose.model('loans', loanSchema);

module.exports=Loan;
