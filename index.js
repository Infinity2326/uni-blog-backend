// входной файл сервера
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import fileUpload from "express-fileupload"
import authRoute from "./routes/auth.js"
import postRoute from "./routes/posts.js"
import newsRoute from "./routes/news.js"
import commentRoute from "./routes/comments.js"
const app = express()
dotenv.config()

// Constants
const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

// Middleware - функция которая дополняет или расширяет настройки базового express
app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(express.static("uploads"))

// Routes регистрация роутов
// http://localhost:3002/
app.use("/api/auth", authRoute)

app.use("/api/posts", postRoute)

app.use("/api/comments", commentRoute)

app.use("/api/news", newsRoute)

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.vvy9kgm.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    )

    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
