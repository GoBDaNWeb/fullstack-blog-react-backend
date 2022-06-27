import CommentModel from '../models/Comment.js'

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id
        console.log(req.body);
        const doc = new CommentModel({
            text: req.body.text,
            author: req.userId,
            postId: postId,
        })

        const comment = await doc.save()

        res.json(comment)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось отправить сообщение'
        })
    }
}

export const getComments = async (req, res) => {
    try {
        const id = req.params.id
        const comments = await CommentModel.find({postId: id}).populate('author').sort({ createdAt: 'desc' })

        res.json(comments)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось получить сообщения'
        })
    }
}