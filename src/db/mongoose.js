const mongoose = require('mongoose')
// Connecting to database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
})
