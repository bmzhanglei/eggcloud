'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Users = app.model.define('users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(255),
    password: STRING(255),
    email:STRING(100),
    status:INTEGER,  //用户状态 1:正常  0:停用
    roleId:INTEGER
  },{    
    timestamps: false,  //表示：不自动增加创建时间
    tableName: 'users'   //表示：指定表名称
  });

  Users.associate = function(){
    app.model.Users.belongsTo(app.model.Roles,{foreignKey: 'roleId'})
  }

  return Users;
};