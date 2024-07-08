const { Sequelize, DataTypes } = require("sequelize");

class viewHistory extends Sequelize.Model {
    static init(sequelize) {
        return super.init ({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                references:{
                    model : 'users',
                    key : 'id'
                }
            },
            study_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'studys',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: true,
            modelName: 'ViewHistory',
            tableName: 'view_history',
            paranoid: false,
        });
    }
}