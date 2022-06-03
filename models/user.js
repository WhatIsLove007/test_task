import { Model } from 'sequelize';
import { UserInputError } from 'apollo-server-express';

import { USER_ROLES, USER_STATUSES, ERROR_MESSAGES } from '../config/const.js';
import * as inputDataValidation from '../utils/inputDataValidation.js';
import fs from 'fs';
import { finished } from 'stream/promises';
import path from 'path';


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

  static async checkLoginExistence(login) {
    const existingLogin = await this.findOne({where: {login}});
    if (existingLogin) throw new Error(ERROR_MESSAGES.LOGIN_ALREADY_EXISTS);
  }
  
  static async checkEmailExistence(email) {
    const existingEmail = await this.findOne({where: {email}});
    if (existingEmail) throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  static validateLogin(login) {
    if (!inputDataValidation.validateLogin(login)) throw new UserInputError('Incorrect login');
  }

  static validateEmail(email) {
    if (!inputDataValidation.validateEmail(email)) throw new UserInputError('Incorrect email');
  }

  static validatePassword(password) {
    if (!inputDataValidation.validatePassword(password)) throw new UserInputError('Incorrect password');
  }

  static async saveAvatar(file, userId) {

    if (file) {
      const avatarPath = path.join(__dirname, '../uploads/user/avatars/');
      
      const { createReadStream, mimetype } = await file;
      
      inputDataValidation.isImage(mimetype);

      const stream = createReadStream();

      const avatarName = `${userId}.jpg`;
      const out = fs.createWriteStream(avatarPath + avatarName);

      stream.pipe(out);
      await finished(out);

      return avatarName;
    }

    return null;

  }

  static deleteAvatar(avatarName) {
    const avatarPath = path.join(__dirname, `../uploads/user/avatars/${avatarName}`);
    if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
  }

};