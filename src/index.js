const express = require('express')
require('./db/mongoose') //make file run
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT


// Middleware functions
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('Get requests are disabled')
//     } else {
//         next()
//     }
// })

// const multer = require('multer')
// const upload = multer({
//     dest: 'images'
// })


// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })


app.use(express.json()) // parse the incoming request to json file
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () =>{
    console.log(`Server is up on port ${port}`);
})


// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const task = await Task.findById('5d6bf772d6e3381f46816d69')
//     await task.populate('owner').execPopulate() // to get whole data of the owner
//     console.log(task.owner)    

//     const user = await User.findById('5d6bf5ad6427081ca674acc0')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks);
    
// }

// main()