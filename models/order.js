import { Model } from 'sequelize';

export default class Order extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      managerId: {
        type: DataTypes.INTEGER,
        references: {model: 'Users'},
      },
      shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'Shops'},
      },
      shopName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      managerFullName: {
        type: DataTypes.STRING,
      },
      clientFullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      tourDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['IN_PROCESSING', 'NEW', 'DELIVERY', 'CANCELED'],
        defaultValue: 'IN_PROCESSING',
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {updatedAt: false, sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'managerId'});
    this.belongsTo(models.Shop, {foreignKey: 'shopId'});
  }
  
};