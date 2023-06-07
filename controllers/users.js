const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read
  }

  const user = await User.findOne({
    where: {
      id: req.params.id
    },
    attributes: { exclude: [''] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['id', 'read'],
          where
        }
      }
    ]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const { username } = req.params
  const { newUsername } = req.body

  const user = await User.findOne({ where: { username } })

  if (user && newUsername) {
    user.username = newUsername
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
