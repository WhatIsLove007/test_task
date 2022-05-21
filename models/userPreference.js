import { Model } from 'sequelize';

export default class UserPreference extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    }, {timestamps: false, sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
  }
  
};