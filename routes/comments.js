import { Router } from "express"
const router = new Router()
import { checkAuth } from "../utils/checkAuth.js"
import {
  createPostComment,
  createNewsComment,
} from "../controllers/comments.js"

// Create Comment
// http://localhost:3002/api/comments/posts/:id
router.post("/posts/:id", checkAuth, createPostComment)

// Create Comment
// http://localhost:3002/api/comments/news/:id
router.post("/news/:id", checkAuth, createNewsComment)
export default router
