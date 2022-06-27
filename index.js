import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import cors from 'cors'

import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation} from './validations.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {UserController, PostController, CommentController} from './controllers/index.js'

mongoose
    .connect(porcess.env.MONGODB_URI)
    .then(() => {console.log('💾DB OK💾')})
    .catch((err) => console.log('🚫DB ERR🚫', err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/add-comment/:id', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.addComment)
app.get('/get-comments/:id', CommentController.getComments)

app.get('/tags', PostController.getLastTags)
app.get('/tags/:id', PostController.getPostsByTag)

app.get('/posts/all', PostController.getAllPosts)
app.get('/posts/popular', PostController.getPopularPosts)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOnePost)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.patch('/posts/:id', checkAuth, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

// * запускает локальный сервер
app.listen(process.env.PORT || 1818, (err) => {
    if (err) {
        return console.log(err);
    } 

    console.log('🎉Server OK🎉');
})