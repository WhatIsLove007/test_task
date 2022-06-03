import { Model } from 'sequelize';

import { ERROR_MESSAGES } from '../config/const.js';

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
    this.hasMany(models.UserAddress, {as: 'country', foreignKey: 'countryId'});
  }

  static async findCountryById(id) {
    const country = await this.findByPk(id);
    if (!country) throw new Error(ERROR_MESSAGES.COUNTRY_NOT_FOUND);
  }
  
};