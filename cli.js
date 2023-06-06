require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: { type: DataTypes.TEXT },
    url: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 }
  },
  { sequelize, underscored: true, timestamps: false, modelName: 'blog' }
)
Blog.sync()

printBlogs = async () => {
  try {
    const blogs = await Blog.findAll()

    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
  }
}

printBlogs()
