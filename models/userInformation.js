import { Model } from 'sequelize';

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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ['MALE', 'FEMALE'],
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: false,
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