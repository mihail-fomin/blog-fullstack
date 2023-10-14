import Comment from '../models/Comment.js'; // Импорт модели Comment

// Методы для создания, получения, обновления и удаления комментариев.

export const createComment = async (req, res) => {
  try {
    // Создание и сохранение нового комментария в базе данных
    const { text } = req.body
    const user = req.userId // Получение ID авторизованного пользователя
    const post = req.params.postId // Получение ID поста из параметра URL

    const newComment = new Comment({
      text,
      user,
      post,
    })

    const savedComment = await newComment.save()

    // Отправка ответа с созданным комментарием
    res.status(201).json(savedComment)
  } catch (error) {
    // Обработка ошибки и отправка ответа с ошибкой
    console.error(error);
    res.status(500).json({ message: 'Не удалось создать комментарий' })
  }
}

export const getCommentsForPost = async (req, res) => {
  try {
    // Получение всех комментариев, относящихся к конкретному посту
    // Отправка ответа с массивом комментариев
  } catch (error) {
    // Обработка ошибки и отправка ответа с ошибкой
  }
}

// Добавьте аналогичные методы для обновления и удаления комментариев.

// Примерный шаблон для обновления комментария:
export const updateComment = async (req, res) => {
  try {
    // Обновление текста комментария и других данных
    // Отправка ответа с успешным результатом
  } catch (error) {
    // Обработка ошибки и отправка ответа с ошибкой
  }
}

// Примерный шаблон для удаления комментария:
export const deleteComment = async (req, res) => {
  try {
    // Удаление комментария из базы данных
    // Отправка ответа с успешным результатом
  } catch (error) {
    // Обработка ошибки и отправка ответа с ошибкой
  }
}
