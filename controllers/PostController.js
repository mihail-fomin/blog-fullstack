import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: 'user', select: ["fullName", "avatarUrl"] });
    res.json(posts)
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Didn\'t manage to get an article'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after', }
    )

    if (!doc) {
      return res.status(404).json({
        message: 'An article was not found'
      })
    }

    res.json(doc)
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Didn\'t manage to get an article'
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Didn\'t manage to create an article'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id
    if (!postId) {
      return res.status(404).json({
        message: 'An article was not found'
      })
    }
    const doc = await PostModel.findByIdAndDelete({
      _id: postId
    })

    if (!doc) {
      return res.status(404).json({
        message: 'An article was not found'
      })
    }

    res.json({
      success: true
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Didn\'t manage to remove an article'
    })
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
        user: req.userId,
        tags: req.body.tags,
      }
    )

    res.json({
      success: true
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Didn\'t manage to update an article'
    })
  }
}