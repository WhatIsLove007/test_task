import { Model } from 'sequelize';
import { USER_GENDERS } from '../config/const.js';

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
  
};