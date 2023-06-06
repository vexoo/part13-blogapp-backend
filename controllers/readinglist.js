const router = require('express').Router()

const { Readinglist } = require('../models/index')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const readingListEntry = await Readinglist.create(req.body)
  res.json(readingListEntry)
})

router.get('/', async (req, res) => {
  const readingList = await Readinglist.findAll()
  res.json(readingList)
})

router.get('/:id', async (req, res) => {
  const listEntry = await Readinglist.findByPk(req.params.id)
  res.json(listEntry)
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const readingList = await Readinglist.findByPk(req.params.id)
  if (!readingList) {
    return res.status(404).end()
  }

  const userId = req.decodedToken.id
  if (readingList.userId !== userId) {
    next(Error('Invalid user to mark readinglist'))
  }

  readingList.read = req.body.read
  const updatedList = await readingList.save()
  res.json(updatedList)
})

module.exports = router
