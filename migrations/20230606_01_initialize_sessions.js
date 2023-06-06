const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      token: {
        type: DataTypes.TEXT,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
    await queryInterface.removeColumn('users', 'disabled')
  }
}
