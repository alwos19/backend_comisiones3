'use strict';
const {

    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cumplido extends Model {

        static associate(models) {
            Cumplido.belongsTo(models.Comision, { as: "comisiones", foreignKey: "comision_id" });
        }
    };
    Cumplido.init({
        fecha_envio: DataTypes.DATE,
        fecha_confirmacion: DataTypes.DATE,
        informacion_complementaria: DataTypes.STRING,
        correos: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Cumplido',
        tableName: 'cumplidos',
    });
    return Cumplido;
};