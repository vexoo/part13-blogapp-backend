const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init(
  {
    token: {
      type: DataTypes.TEXT,
      primaryKey: true
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'session'
  }
)

module.exports = Session
