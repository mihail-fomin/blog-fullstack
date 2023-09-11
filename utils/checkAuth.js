import jwt from 'jsonwebtoken'


export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

  if (token) {
    try {
      // расшифровываем токен
      const decoded = jwt.verify(token, 'secret123')
      // передаем его в userId
      req.userId = decoded._id
      next()
    } catch (error) {
      return res.status(403).json({
        message: 'Нет доступа'
      })
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа'
    })
  }
}