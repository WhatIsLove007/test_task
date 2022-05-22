import { Model } from 'sequelize';

export default class Review extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      tourId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Tours'},
        onDelete: 'cascade',
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      userFullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      assessment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 5,
        },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {updatedAt: false, sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'})
    this.belongsTo(models.Tour, {onDelete: 'cascade', foreignKey: 'tourId'})
  }
  
};