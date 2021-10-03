'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const RoleCategory = app.model.define('RoleCategory', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },      
    roleId: INTEGER(11),
    cateId: INTEGER(11) 
  },{
    timestamps: false, //自动增加创建时间 
    tableName: 'role_cate' //设置表名称
  });  
  return RoleCategory;
};