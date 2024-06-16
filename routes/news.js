// Routes/эндпоинты, адреса на которые будут отправляться запросы, чтобы бэкэнд понимал, как его обработать
import { Router } from "express"
import {
  getById,
  getNews,
  getNewsComments,
  likeNews,
  refreshNews,
} from "../controllers/news.js"

const router = new Router()

// Get news
// http://localhost:3002/api/news
router.get("/", getNews)

// Get news by id
// http://localhost:3002/api/news/:id
router.get("/:id", getById)

// Refresh news
// http://localhost:3002/api/news/refresh/:id
router.get("/refresh/:id", refreshNews)

// Get news comments
// http://localhost:3002/api/news/comments/:id
router.get("/comments/:id", getNewsComments)
export default router

// Like news
// http://localhost:3002/api/news/like/:id
router.put("/like/:id", likeNews)
