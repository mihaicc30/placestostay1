const Sequelize = require("sequelize")
const sequelize = require("../models/Database")

const User = sequelize.define('acc_users', {
  ID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  password: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  admin: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  }
}
,
  {
    freezeTableName: true,
    timestamps: false,
    raw:true
  }
  )

module.exports = User