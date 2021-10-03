'use strict';

const { isObjectBindingPattern } = require("typescript");

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config: { apiPrefix } } = app;

  router.get('/login/test', controller.login.test);

  router.get('/login/captcha', controller.login.captcha);
  router.post('/login/doLogin', controller.login.doLogin);
  router.post('/login/loginOut', controller.login.loginOut);

  router.get('/user/index', controller.user.index);  //获取用户
  router.post('/user/addUser', controller.user.addUser);  //添加用户
  router.post('/user/delUser', controller.user.delUser);  //删除用户
  router.post('/user/editUser', controller.user.editUser);  //编辑用户

  router.get('/role', controller.roles.index);  //获取角色  带用户
  router.get('/role/getRoles', controller.roles.getRoles);
  router.post('/role/addRole', controller.roles.addRole);
  router.post('/role/editRole', controller.roles.editRole);
  router.post('/role/delRole', controller.roles.delRole);

  router.get('/category', controller.category.index);
  router.get('/category/find', controller.category.find);  //传入 typeId 
  router.post('/category/addCate', controller.category.addCate);
  router.post('/category/delCate', controller.category.delCate);

  router.post('/fileupload/fileAdd', controller.fileupload.fileAdd);
  router.post('/fileupload/fileAdds', controller.fileupload.fileAdds); //上传多个文件
  router.post('/fileupload/fileAddCos', controller.fileupload.fileAddCos); //上传文件到腾讯云 Cos
  router.post('/fileupload/fileDelCos', controller.fileupload.fileDelCos); //删除腾讯云 Cos 上文件
  // router.post('/fileupload/showCode', controller.fileupload.showCode); // 合成二维码
  router.post('/fileupload/showQrCode', controller.fileupload.showQrCode); // 返回合单个二维码

   //socket.io
   app.io.of('/').route('clientMsg',app.io.controller.default.index)
};
