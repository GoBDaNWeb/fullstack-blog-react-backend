import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()

        const tags = posts
            .map(obj => obj.tags)
            .flat()
            .slice(0, 5)

    
        res.json(tags)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось получить Статьи'
        })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').sort({ createdAt: 'desc' }).exec()

        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось получить Статьи'
        })
    }
}

export const getPopularPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').sort({ viewsCount: 'desc' }).exec()

        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось получить Статьи'
        })
    }
}

export const getPostsByTag = async (req, res) => {
    try {
        const tag = req.params.id

        const posts = await PostModel.find({tags: tag}).populate('author').sort({ createdAt: 'desc' }).exec()

        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось получить Статьи'
        })
    }
}

export const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            }, 
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                            success: false,
                            message: 'Не удалось получить Статью'
                        })
                }

                if (!doc) {
                    return res.status(404).json({
                        success: false,
                        message: 'Статья не найдена'
                    })
                }

                res.json(doc)
            }
        ).populate('author')
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось получить Статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete(
            {
                _id: postId,
            }, 
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                            success: false,
                            message: 'Не удалось удалить Статью'
                        })
                }

                if (!doc) {
                    return res.status(404).json({
                        success: false,
                        message: 'Статья не найдена'
                    })
                }

                res.json({
                    success: true
                })
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось получить Статью'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            author: req.userId,
        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось создать Статью'
        })
    }
}


export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne(
            {
                _id: postId,
            }, 
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                author: req.userId,
            }
        )

        res.json({
            success: true
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось обновить Статью'
        })
    }
}