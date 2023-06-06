const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    const keyword = `%${req.query.search}%`

    where[Op.or] = [
      { title: { [Op.iLike]: keyword } },
      { author: { [Op.iLike]: keyword } }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['username', 'name']
    },
    order: [['likes', 'DESC']],
    where
  })
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date()
  })
  res.json(blog)
})

router.delete('/:id', [blogFinder, tokenExtractor], async (req, res) => {
  console.log(req.blog.toJSON().userId, 'line 31')
  console.log(req.decodedToken.id)
  if (req.blog.toJSON().userId === req.decodedToken.id) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
