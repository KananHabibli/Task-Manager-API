const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if ( validator.contains('password',value)){
                throw new Error('Password can not contain the word password')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if ( value < 0 ) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
    
}, {
    timestamps: true
})

// Virtual property (such as user's tasks)

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function(){
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks when user is deleted

userSchema.pre('remove', async function (next){
    const user = this

    await Task.deleteMany({ owner: user._id })
    
    next()
})

// Creating a model
const User = mongoose.model('User' , userSchema)

module.exports = User



// Creating new data with the model
// const me = new User({
//     name: '  Kanan  ',
//     email: 'HabIblikanan@gmail.Com',
//     password: 'ecmascript'
// })
// // Adding data to the database
// me.save().then(()=> {
//     console.log(me)
// }).catch( error => {
//     console.log(error);
// })
