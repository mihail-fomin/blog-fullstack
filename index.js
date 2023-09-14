import express, { response } from 'express'
import config from 'config'
import mongoose from 'mongoose';
import { postCreateValidation, registerValidation } from './validations/validation.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose
  .connect(config.get('MONGO_DB_PATH'))
  .then(() => console.log('DB OK!'))
  .catch(err => console.log('DB error: ', err))

const app = express();

app.use(express.json())

app.post('/auth/login', UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
// app.delete('/posts', PostController.remove)
// app.patch('/posts', PostController.update)


app.listen(4444, err => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK!');

});