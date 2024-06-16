import Post from "../models/Post.js"
import User from "../models/User.js"
import Comment from "../models/Comment.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

// Constants
const TOKEN = process.env.TOKEN
const CHAT_ID = process.env.CHAT_ID

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body
    const user = await User.findById(req.userId)
    // Работа с изображением поста
    if (req.files) {
      // присваиваем уникальное имя для изображения
      let fileName = Date.now().toString() + req.files.image.name
      // получаем путь к текущей папке (контроллеры)
      const __dirname = dirname(fileURLToPath(import.meta.url))
      // перемещаем изображение из папки controller в uploads
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName))

      const newPostWithImage = new Post({
        username: user.username,
        title,
        text,
        imgUrl: fileName,
        author: req.userId,
      })

      await newPostWithImage.save()
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage },
      })

      return res.json({ newPostWithImage })
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      text,
      imgUrl: "",
      author: req.userId,
    })

    await newPostWithoutImage.save()
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithoutImage },
    })

    return res.json({ newPostWithoutImage })
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

// Get all posts
export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAd")
    const popularPosts = await Post.find().limit(5).sort("-views")
    if (!posts) {
      return res.json({ message: "Постов нет" })
    }

    res.json({ posts, popularPosts })
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

// Get post by id
export const getById = async (req, res) => {
  try {
    // req.params.id айдишник самого поста
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    })
    res.json(post)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

// Refresh post's data
export const refreshPost = async (req, res) => {
  try {
    // req.params.id айдишник самого поста
    const post = await Post.findById(req.params.id)
    res.json(post)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

// Get user's posts
export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id)
      })
    )

    res.json(list)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

// Remove post by id
export const removePost = async (req, res) => {
  try {
    // req.params.id айдишник самого поста
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.json({ message: "Такого поста не существует" })

    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    })
    res.json({ message: "Пост был удален" })
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

// Edit post
export const updatePost = async (req, res) => {
  try {
    // req.params.id айдишник самого поста
    const { title, text, id } = req.body
    // получаем пост для редактирвоания по его айди
    const post = await Post.findById(id)

    if (req.files) {
      // присваиваем уникальное имя для изображения
      let fileName = Date.now().toString() + req.files.image.name
      // получаем путь к текущей папке (контроллеры)
      const __dirname = dirname(fileURLToPath(import.meta.url))
      // перемещаем изображение из папки controller в uploads
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName))
      post.imgUrl = fileName || ""
    }
    // перезаписываем поля текста и заголовка и сохраняем
    post.title = title
    post.text = text

    await post.save()

    res.json(post)
  } catch (error) {
    res.json({ message: "Что-то пошло не так. update" })
  }
}

// Approve post to main page
export const approvePost = async (req, res) => {
  try {
    const p = await Post.findById(req.params.id)
    const post = await Post.findById(p._id)
    post.approved = true
    await post.save()

    if (post.imgUrl) {
      axios.get(
        `https://api.telegram.org/bot${TOKEN}/sendPhoto?chat_id=${CHAT_ID}&photo=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxI1QYjzO6LuN1VJwVhvNdA4Ej5LzxXvGfAg&s&caption=${post.title}%0A${post.text}%0AАвтор: ${post.username}`
      )
    } else {
      axios.get(
        `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${post.title}%0A${post.text}%0AАвтор: ${post.username}`
      )
    }
    res.json(post)
  } catch (error) {
    res.json({ message: "Что-то пошло не так. approve" })
  }
}

// Fetch post's comments
export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment)
      })
    )
    res.json(list)
  } catch (error) {
    console.log(error)
  }
}

// Like post
export const likePost = async (req, res) => {
  try {
    const { postId, user } = req.body
    const post = await Post.findById(postId)
    if (
      !post.whoLiked.find((id) => {
        if (id === user._id) {
          return true
        }
      })
    ) {
      await Post.findByIdAndUpdate(postId, {
        $inc: { likes: 1 },
        $push: { whoLiked: user._id },
      })
    } else {
      await Post.findByIdAndUpdate(postId, {
        $inc: { likes: -1 },
        $pull: { whoLiked: user._id },
      })
    }

    const result = await Post.findById(postId)
    res.json(result)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}
