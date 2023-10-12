import PostModel from '../models/Post.js'

const handleErrorResponse = (res, error, message) => {
  console.log(error);
  res.status(500).json({ message })
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(tag => tag.tags).flat().slice(0, 5)

    res.json(tags)
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error, 'Didn\'t manage to get tags')
  }
}

export const getAllLatest = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: 'user', select: ["fullName", "avatarUrl"] });
    res.json(posts)
  } catch (error) {
    handleErrorResponse(res, error, 'Didn\'t manage to get articles')
  }
}

export const getAllMostPopular = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: 'user', select: ["fullName", "avatarUrl"] })
      .sort({ viewsCount: -1 });
    res.json(posts)
  } catch (error) {
    handleErrorResponse(res, error, 'Didn\'t manage to get articles')
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after', }
    ).populate('user')

    if (!doc) {
      return res.status(404).json({
        message: `An article with id ${postId} was not found`,
      })
    }

    res.json(doc)
  } catch (error) {
    handleErrorResponse(res, error, 'Didn\'t manage to get an article')
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(' '),
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (error) {
    handleErrorResponse(res, error, 'Didn\'t manage to create an article')
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id
    if (!postId) {
      return res.status(404).json({
        message: `An article with id ${postId} was not found`,
      })
    }
    const doc = await PostModel.findByIdAndDelete({
      _id: postId
    })

    if (!doc) {
      return res.status(404).json({
        message: 'An article was not found',
        postId: postId // Включаем информацию о ненайденном ID
      })
    }

    res.json({
      success: true
    })
  } catch (error) {
    handleErrorResponse(res, error, 'Didn\'t manage to remove an article')
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne(
      { _id: postId, },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(' '),
        user: req.userId,
      }
    )

    res.json({
      success: true
    })
  } catch (error) {
    handleErrorResponse(res, error, 'Didn\'t manage to update an article')
  }
}