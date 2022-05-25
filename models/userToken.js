import { Model } from 'sequelize';

export default class UserToken extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      encryptedPasswordResetToken: {
        type: DataTypes.STRING,
        unique: true,
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
      },
      facebookId: {
        type: DataTypes.STRING,
        unique: true,
      },
      linkedinId: {
        type: DataTypes.STRING,
        unique: true,
      },
    }, {timestamps: false, sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
  }
  
};