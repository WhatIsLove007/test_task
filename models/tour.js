import { Model } from 'sequelize';

export default class Tour extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'Shops'},
      },
      managerId: {
        type: DataTypes.INTEGER,
        references: {model: 'Users'},
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      info: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    }, {timestamps: false, sequelize})
  }

  static associate(models) {
    this.belongsTo(models.Shop, {foreignKey: 'shopId'});
    this.belongsTo(models.User, {foreignKey: 'managerId'});
    this.hasMany(models.Review, {onDelete: 'cascade', foreignKey: "tourId"});
  }
  
};