const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const middleware = require('./util/middleware')

const blogsRouter = require('./controllers/blogs')
const authorsRouter = require('./controllers/authors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const listRouter = require('./controllers/readinglist')
const logoutRouter = require('./controllers/logout')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/readinglists', listRouter)
app.use('/api/logout', logoutRouter)

app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
