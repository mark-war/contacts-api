const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a contact name.']
    },
    email: {
        type: String,
        required: [true, 'Please add a contact email address.'],
        unique: [true, 'Email address already exists.']
    },
    password: {
        type: String,
        required: [true, 'Please add a user password.']
    }
},{ 
    timestamps: true 
})

module.exports = mongoose.model('Users', userSchema)