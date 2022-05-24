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
      hashedGoogleId: {
        type: DataTypes.STRING,
      },
      hashedFacebookId: {
        type: DataTypes.STRING,
      },
    }, {timestamps: false, sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
  }
  
};