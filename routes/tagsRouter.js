import Router from 'express'
import {PostController} from '../controllers/index.js'

const tagsRouter = Router()

tagsRouter.get('/', PostController.getLastTags)
tagsRouter.get('/:id', PostController.getPostsByTag)

export default tagsRouter