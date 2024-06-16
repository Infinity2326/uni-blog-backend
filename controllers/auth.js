// для декомпозиции создаются контроллеры, которые отвечают за логику роутов
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Register user

// в каждом запросе есть request и response
export const register = async (req, res) => {
  try {
    // получаем данные с фронта
    const { username, password } = req.body
    // ищем юзера
    const isUsed = await User.findOne({ username })
    // проверка на наличие юзера в дб
    if (isUsed) {
      // return res.status(402) можно почитать про статусы
      return res.json({
        message: "Данный username занят",
      })
    }
    // если свободен, то генерируем хэш пароля
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    // Creating example of class user for new user,
    const newUser = new User({
      username,
      password: hash,
      role: "user",
    })

    const token = jwt.sign(
      {
        id: newUser.id, // зашифрованные данные
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    // Saving user to a database
    await newUser.save()
    // отправляем пользователя на фронтенд
    res.json({
      newUser,
      token,
      message: "Регистрация прошла успешно",
    })
  } catch (error) {
    res.json({ message: `Ошибка при создании пользователя ${error}` })
  }
}
// Login user
export const login = async (req, res) => {
  try {
    // получаем данные с фронта
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      return res.json({ message: "Данного пользователя не существует" })
    }
    // сравнение пароля с фронтенда и хэшированного из базы данных
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.json({ message: "Неверный пароль" })
    }
    // создание токена для проверки авторизации пользователя. позволяет сделать защиту доступа для роутов
    // токен - цифровой ключ для шифрования
    const token = jwt.sign(
      {
        id: user._id, // зашифрованные данные
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    res.json({
      token,
      user,
      message: "Вы вошли в систему",
    })
  } catch (error) {
    res.json({ message: "Ошибка при авторизации" })
  }
}

// Get me
// данный роут отрабатывает всегда при обновлении страницы, если страница обновлена, то нужно снова войти для сохранения логина
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.json({ message: "Данного пользователя не существует" })
    }
    const token = jwt.sign(
      {
        id: user._id, // зашифрованные данные
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    res.json({ user, token })
  } catch (error) {
    res.json({ message: "Нет доступа" })
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort("-createdAd")

    if (!users) {
      return res.json({ message: "Пользователей нет" })
    }
    res.json({ users })
  } catch (error) {
    res.json({ message: "Нет доступа" })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { u, r } = req.body
    const user = await User.findById(u._id)
    user.role = r
    await user.save()

    res.json(user)
  } catch (error) {
    res.json({ message: "Что-то пошло не так." })
  }
}
