import jwt from "jsonwebtoken"

// middleware (промежуточное программное обеспечение) расширение/дополнение существующего функционала
export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/bearer\?/, "")
  if (token) {
    try {
      // расшифровка токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // добавляем дополнительное поле id
      req.userId = decoded.id

      next()
    } catch (error) {
      return res.json({ message: "Нет доступа" })
    }
  } else {
    return res.json({ message: "Нет доступа" })
  }
}
