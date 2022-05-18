import { Model } from 'sequelize';

export default class UserAddress extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'Countries'},
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      additionalAddress: {
        type: DataTypes.STRING,
      },
    }, {timestamps: false, sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
    this.belongsTo(models.Country, {foreignKey: 'countryId'});
  }
  
};