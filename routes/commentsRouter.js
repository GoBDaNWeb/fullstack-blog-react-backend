import Router from 'express'
import {checkAuth, handleValidationErrors} from '../middleware/index.js'
import {commentCreateValidation} from '../validations.js'
import {CommentController} from '../controllers/index.js'

const commentsRouter = Router()

commentsRouter.post('/add-comment/:id', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.addComment)
commentsRouter.get('/get-comments/:id', CommentController.getComments)


export default commentsRouter