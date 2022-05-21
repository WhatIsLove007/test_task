import { Model } from 'sequelize';

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
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'BANNED'],
        defaultValue: 'ACTIVE',
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['CLIENT', 'MANAGER'],
        defaultValue: 'CLIENT',
        allowNull: false,
      },
      shopId: {
        type: DataTypes.INTEGER,
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
    this.hasMany(models.FavoritePhotocard, {onDelete: 'cascade', foreignKey: "userId"});
    this.hasMany(models.UserPreference, {onDelete: 'cascade', foreignKey: "userId"});
    this.belongsToMany(models.Photocard, {through: models.FavoritePhotocard, foreignKey: 'userId'});
  }
  
};