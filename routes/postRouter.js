import Router from 'express'
import {PostController} from '../controllers/index.js'
import {checkAuth, handleValidationErrors} from '../middleware/index.js'
import {postCreateValidation} from '../validations.js'

const postRouter = Router()

postRouter.get('/all', PostController.getAllPosts)
postRouter.get('/popular', PostController.getPopularPosts)
postRouter.get('/tags', PostController.getLastTags)
postRouter.get('/:id', PostController.getOnePost)
postRouter.post('/', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
postRouter.patch('/:id', checkAuth, PostController.update)
postRouter.delete('/:id', checkAuth, PostController.remove)

export default postRouter