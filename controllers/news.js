import News from "../models/News.js"
import { launch } from "puppeteer"
import Comment from "../models/Comment.js"

// Get news and save them in db
export const getNews = async (req, res) => {
  try {
    const news = await News.find()
    if (!news) {
      return res.json({ message: "Новостей нет" })
    }

    res.json({ news })
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

// Get news by id
export const getById = async (req, res) => {
  try {
    const singleNews = await News.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    })
    res.json(singleNews)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}
// Refresh news' data
export const refreshNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
    res.json(news)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}

// Get news' comments
export const getNewsComments = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
    const list = await Promise.all(
      news.comments.map((comment) => {
        return Comment.findById(comment)
      })
    )
    res.json(list)
  } catch (error) {
    console.log(error)
  }
}

// Like news
export const likeNews = async (req, res) => {
  try {
    const { newsId, user } = req.body
    const news = await News.findById(newsId)
    if (
      !news.whoLiked.find((id) => {
        if (id === user._id) {
          return true
        }
      })
    ) {
      await News.findByIdAndUpdate(newsId, {
        $inc: { likes: 1 },
        $push: { whoLiked: user._id },
      })
    } else {
      await News.findByIdAndUpdate(newsId, {
        $inc: { likes: -1 },
        $pull: { whoLiked: user._id },
      })

      const result = await News.findById(newsId)
      res.json(result)
    }
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}
