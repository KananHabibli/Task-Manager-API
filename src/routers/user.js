const express = require('express')
const router = new express.Router()
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

router.post('/users', async (req, res) =>{
    const user = new User(req.body)
    try{
        await user.save() 
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(error) {
        res.status(400).send(error)
    }
})

// user.save().then(() => {
//     res.status(201).send(user)
// }).catch((error) => {
//     res.status(400).send(error)
// })

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(error){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/users/me', auth , async (req,res) => {
    res.send(req.user)
})

const multer = require('multer')
const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload  jpg, jpeg, png format'))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
} )

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// try{
//   const users =  await User.find()
//   res.send(users)
// } catch(error){
//     res.status(500).send(error)
// }
//   User.find().then(data => {
//       res.send(data)
//   }).catch(error => {
//       res.status(500).send(error)
//   })

// router.get('/users/:id' , async (req, res) => {
//     const _id = req.params.id
//     try{
//        const user = await User.findById(_id)
//        if (!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(error){
//         res.status(500).send()
//     }
// })

// User.findById(_id).then(data => {
//     if (!data){
//         return res.status(404).send()
//     }
//     res.send(data)
// }).catch(error => {
//     res.status(500).send(error)
// })

router.patch('/users/me', auth, async (req, res) => {
    // Validate the field to be updated
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        // const user = await User.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true})
        // const user = await User.findById(req.user._id)        
        // if(!user){
        //     res.status(404).send("Can't find the user")
        // }
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save( )
        res.send(req.user)
    }catch(error){
        res.status(400).send(error)
    }
})


router.delete('/users/me', auth,  async (req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.send(404).send()
        // }
        sendCancelationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router
