import { Model } from 'sequelize';

export default class Country extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      iso: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {timestamps: false, sequelize})
  }

  static associate(models) {
    this.hasMany(models.UserAddress, {foreignKey: 'countryId'});
  }
  
};