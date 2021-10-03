'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Types = app.model.define('types', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name_cn: STRING(255),
    name_en: STRING(255)
  },{    
    timestamps: false,  //表示：不自动增加创建时间
    tableName: 'types'   //表示：指定表名称
  });

  Types.associate = function(){
     app.model.Types.hasMany(app.model.Category,{foreignKey: 'typeId'})
  }

  return Types;
};