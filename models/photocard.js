import { Model } from 'sequelize';

export default class Photocard extends Model {
  
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
    }, {timestamps: false, sequelize})
  }

  static associate(models) {
    this.hasMany(models.FavoritePhotocard, {onDelete: 'cascade', foreignKey: "photocardId"});
    this.belongsToMany(models.User, {through: models.FavoritePhotocard, foreignKey: 'photocardId'});
  }
  
};