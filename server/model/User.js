
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String, 
        required: true,
    },
    password:{
        type: String, 
        required: true,
    },
    friendsTo:{
        type: [String],
        required: true,
    },
    message: {
        type: [[]],
        default: [], 
        
    }
    
})

module.exports = mongoose.model('User', userSchema);
