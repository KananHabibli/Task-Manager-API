const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
description: {
    type: String,
    required: true,
    trim: true
},
completed: {
    type: Boolean,
    default: true
},
owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
}
}, {
    timestamps: true
}) 
const Task = mongoose.model('Task' , taskSchema)

module.exports = Task

// const task = new Task({description: 'Take a walk', completed: true})

// task.save().then(() => {
//     console.log(task)
// }).catch(error => {
//     console.log(error)
// })