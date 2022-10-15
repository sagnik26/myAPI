const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Enter password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Re-enter password'],
        validate: {
            // This only works on CREATE & SAVE
            validator: function(el) {
                return el === this.password 
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: Date
})

// Encrypting password
userSchema.pre('save', async function(next) {
    // only run this function if password was actually modified
    if(!this.isModified('password')) return next()

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete passwordConfirm field
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

        console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp < changedTimestamp
    }

} 

const User = mongoose.model('User', userSchema)

module.exports = User