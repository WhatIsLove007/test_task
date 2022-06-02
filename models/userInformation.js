import { Model } from 'sequelize';
import { UserInputError } from 'apollo-server-express';

import { USER_GENDERS } from '../config/const.js';
import { USER_PROFILE_COMPLETENESS } from '../config/const.js';

export default class UserInformation extends Model {
  static init = (sequelize, DataTypes) => {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM,
        values: [USER_GENDERS.MALE, USER_GENDERS.FEMALE],
      },
      birthdate: {
        type: DataTypes.DATE,
      },
      about: {
        type: DataTypes.TEXT,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      profileHeader: {
        type: DataTypes.STRING,
      },
      desiredVacationFrom: {
        type: DataTypes.DATE,
      },
      desiredVacationUntil: {
        type: DataTypes.DATE,
      },
    }, {timestamps: false, tableName: 'userinformation', sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
  }

  static validateBirthdate(birthdate) {
    if (new Date(birthdate) < new Date(1900, 0, 2) || new Date(birthdate) > new Date()) {
      throw new UserInputError('INCORRECT DATE')
    }
  }

  async calculateProfileCompleteness() {
    let profileCompleted = 0;

    if (this.avatar) profileCompleted += USER_PROFILE_COMPLETENESS.AVATAR;
    if (this.profileHeader) profileCompleted += USER_PROFILE_COMPLETENESS.PROFILE_HEADER;
    if (this.about) profileCompleted += USER_PROFILE_COMPLETENESS.ABOUT;
    if (this.length) profileCompleted += USER_PROFILE_COMPLETENESS.USER_PREFERENCE;

    return profileCompleted;
  }

};