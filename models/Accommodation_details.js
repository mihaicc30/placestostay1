const Sequelize = require("sequelize")
const sequelize = require("./Database")

const Accommodation_details = sequelize.define('accommodation_details', {
  accID: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  ID: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    foreignKey: true
  },
  icon: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  photo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: true,
  },
  main_photo: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
}
,
  {
    freezeTableName: true,
    timestamps: false,
    raw: true
  }
  )

module.exports = Accommodation_details