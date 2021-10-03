'use strict';

module.exports = app => {
  const { STRING,INTEGER, DATE } = app.Sequelize;

  const Category = app.model.define('category', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    nameCn: STRING(255),
    nameEn: STRING(255),
    descriptionCn:STRING(255),
    descriptionEn:STRING(255),
    path:STRING(255),         //路径
    level:INTEGER,
    typeId:INTEGER,
    creator:INTEGER,
    createdAt:DATE,   //创建时间
    pid:INTEGER ,
    status:INTEGER(1),
    sort:INTEGER(11),              //排序
  },{    
    timestamps: false,  //表示：不自动增加创建时间
    tableName: 'category'   //表示：指定表名称
  });

  Category.associate = function(){
    app.model.Category.belongsTo(app.model.Types,{foreignKey: 'typeId'})
    app.model.Category.belongsToMany(app.model.Roles,{
      through: app.model.RoleCategory,
      foreignKey: 'cateId', //注意写法
      otherKey: 'roleId'
    })
  }


  return Category;
};