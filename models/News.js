// описание моделей/схем базы данных
import mongoose from "mongoose"

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
    },
    text: {
      type: String,
      // required: true,
    },
    imgUrl: {
      type: String,
      // required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    whoLiked: [
      {
        type: String,
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model("News", NewsSchema)
