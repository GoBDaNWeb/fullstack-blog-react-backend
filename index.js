import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import cors from 'cors'

import {checkAuth} from './middleware/index.js'
import postRouter from './routes/postRouter.js'
import userRouter from './routes/userRouter.js'
import tagsRouter from './routes/tagsRouter.js'
import commentsRouter from './routes/commentsRouter.js'

mongoose
    .connect(process.env.MONGODB_URL)
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
app.use('/auth', userRouter)
app.use('/posts', postRouter)
app.use('/tags', tagsRouter)
app.use('/comments', commentsRouter)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

// * запускает локальный сервер
app.listen(process.env.PORT || 1818, (err) => {
    if (err) {
        return console.log(err);
    } 

    console.log('🎉Server OK🎉');
})