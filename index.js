import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'
import config from 'config'

import {
  loginValidation,
  registerValidation,
  postCreateValidation,
  handleValidationErrors
} from './validations/index.js'

import checkAuth from './utils/checkAuth.js'
import { UserController, PostController, CommentController } from './controllers/index.js'

mongoose
  .connect(process.env.MONGODB_URI || config.get('MONGO_DB_PATH'))
  .then(() => console.log('DB OK!'))
  .catch(err => console.log('DB error: ', err))

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

// Маршруты для регистрации и логина
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)

app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get('/tags', PostController.getLastTags)


app.get('/posts', async (req, res) => {
  const { sort } = req.query;

  if (sort === 'popular') {
    await PostController.getAllMostPopular(req, res);
  } else {
    await PostController.getAllLatest(req, res);
  }
});

app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)


app.post('/posts/:id/comments', checkAuth, CommentController.createComment)

app.listen(process.env.PORT || 4444, err => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK!');

});