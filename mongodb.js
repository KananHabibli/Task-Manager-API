const { MongoClient, ObjectID} = require('mongodb')

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