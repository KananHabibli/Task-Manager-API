// CRUD operations

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID} = require('mongodb')
// const id = new ObjectID() // generating new IDs
// console.log(id.id)
// console.log(id.toHexString())
// console.log(id.getTimestamp())

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateindex: true,
    useFindAndModify: true }, 
     (error,client) => {
    if(error){
        return console.log('Unable to connect to database');   
    }
    
    const db = client.db(databaseName)

    
})