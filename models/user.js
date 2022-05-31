import { Model } from 'sequelize';
import { USER_ROLES, USER_STATUSES } from '../config/const.js';

export default class User extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      login: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM,
        values: [USER_STATUSES.ACTIVE, USER_STATUSES.BANNED],
        defaultValue: USER_STATUSES.ACTIVE,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: [USER_ROLES.CLIENT, USER_ROLES.MANAGER],
        defaultValue: USER_ROLES.CLIENT,
        allowNull: false,
      },
      shopId: {
        type: DataTypes.INTEGER,
        references: {model: 'Shops'},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {updatedAt: false, sequelize})
  }

  static associate(models) {
    this.hasOne(models.UserInformation, {onDelete: 'cascade', foreignKey: 'userId'});
    this.hasOne(models.UserAddress, {onDelete: 'cascade', foreignKey: 'userId'});
    this.hasOne(models.UserToken, {onDelete: 'cascade', foreignKey: 'userId'});
    this.hasOne(models.Order, {foreignKey: 'managerId'});
    this.hasMany(models.FavoritePhotocard, {onDelete: 'cascade', foreignKey: "userId"});
    this.hasMany(models.UserPreference, {onDelete: 'cascade', foreignKey: "userId"});
    this.hasMany(models.Review, {onDelete: 'cascade', foreignKey: "userId"});
    this.belongsTo(models.Shop, {foreignKey: 'shopId'});
    this.belongsToMany(models.Photocard, {through: models.FavoritePhotocard, foreignKey: 'userId'});
  }
  
};