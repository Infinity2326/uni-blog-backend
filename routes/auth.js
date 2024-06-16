// Routes/эндпоинты, адреса на которые будут отправляться запросы, чтобы бэкэнд понимал, как его обработать
import { Router } from "express"
import {
  register,
  login,
  getMe,
  getUsers,
  updateUser,
} from "../controllers/auth.js"
import { checkAuth } from "../utils/checkAuth.js"
const router = new Router()

// Register
// http://localhost:3002/api/auth/register
router.post("/register", register)

// Login
// http://localhost:3002/api/auth/login
router.post("/login", login)

// Get me
// http://localhost:3002/api/auth/me
router.get("/me", checkAuth, getMe)

// Get users
// http://localhost:3002/api/auth/users
router.get("/users", checkAuth, getUsers)

// Update user by id
// http://localhost:3002/api/auth/users/:id
router.put("/users/:id", checkAuth, updateUser)
export default router
