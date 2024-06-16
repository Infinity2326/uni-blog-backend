import Comment from "../models/Comment.js"
import Post from "../models/Post.js"
import News from "../models/News.js"

export const createPostComment = async (req, res) => {
  try {
    const { postId, comment } = req.body

    if (!comment)
      return res.json({ message: "Комментарий не может быть пустым" })

    const newComment = new Comment({ comment })
    await newComment.save()

    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      })
    } catch (error) {
      console.log(error)
    }

    res.json(newComment)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

export const createNewsComment = async (req, res) => {
  try {
    const { newsId, comment } = req.body

    if (!comment)
      return res.json({ message: "Комментарий не может быть пустым" })

    const newComment = new Comment({ comment })
    await newComment.save()

    try {
      await News.findByIdAndUpdate(newsId, {
        $push: { comments: newComment._id },
      })
    } catch (error) {
      console.log(error)
    }

    res.json(newComment)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}
