'use strict';
module.exports = app => {
    const {
        STRING,
        INTEGER,
        DATE
    } = app.Sequelize;

    const Roles = app.model.define('roles', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name_cn: STRING(255),
        name_en: STRING(255),
        creator: STRING,
        created_at: DATE,       
        updated_at: DATE       
    },{
        timestamps:false,
        tableName:'roles'
    });
    
    Roles.associate = function(){
        app.model.Roles.hasMany(app.model.Users, {foreignKey: 'roleId'})
        app.model.Roles.belongsToMany(app.model.Category,{
            through:app.model.RoleCategory,
            foreignKey: 'roleId',
            otherKey: 'cateId'
        })
    }



    return Roles;
};