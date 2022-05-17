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
      country: {
        type: DataTypes.ENUM,
        values: [
          'GREAT_BRITAIN',
          'LATVIA',
          'LITHUANIA',
          'MOLDOVA',
          'GERMANY',
          'POLAND',
          'ROMANIA',
          'USA',
          'TURKEY',
          'UKRAINE',
          'FRANCE',
        ],
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      index: {
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
    }, {updatedAt: false, sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
  }
  
};