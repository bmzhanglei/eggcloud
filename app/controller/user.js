'use strict';

const { Controller } = require('egg');

const {Op} = require('sequelize');
class UserController extends Controller {
  //查询用户和角色
  async index(){
    const { ctx } = this;
    const {username} =  ctx.request.query  
    let where = {
      include:{
        model:ctx.model.Roles
      }
    }
    //根据用户名查询
    if(username){
      where.where = {
        username:{
          [Op.like]:`%${username}%`   
        }     
      }
    }
    let result = await ctx.model.Users.findAll(where)    
    ctx.body = {status:200, msg:'success',result }
  }
  
  //添加用户
  async addUser() {
      let {username,password,email,roleId} = this.ctx.request.body       
      const {tools} = this.ctx.service
    
      if(username===""){
        this.ctx.body = {status:416, msg:'error',tip:"用户名不能为空！" }
        return
      }     
      if(password==="" || password && password.toString().length<6){
        this.ctx.body = {status:416, msg:'error',tip:"密码不能为空且不能小于6位！" }
        return
      }
       //3、数据库表里面有没有当前用户
      let user = await this.ctx.model.Users.findAll({
          where: { username}
        }) 
        if(user.length>0){
            this.ctx.body = {status:416, msg:'error',tip:"该用户名已经存在！" }
            return;
        }else{
          password = tools.cmd5(password.toString())
          await this.ctx.model.Users.create({username,password,email,roleId})
          this.ctx.body = {status:200, msg:'success',tip:"用户添加成功！" }
        }
  }

  //删除用户
  async delUser() {
    try {
      let id = this.ctx.request.body.id;
      let user = await this.ctx.model.Users.findByPk(id);
      if (!user) {
        this.ctx.body = {status:416, msg:'error',tip:"非法请求！" }
        return;
       }
      user.destroy();
      this.ctx.body = {status:200, msg:'success',tip:"用户删除成功！" }
    } catch (error) {
       this.ctx.body = {status:416, msg:'error',tip:"非法请求！" }
    } 
  }

   //编辑用户
   async editUser() {
     console.log('editUser----',this.ctx.session)
    //  console.log(this.ctx)

    try {
      const {tools} = this.ctx.service   
      let {id,password,roleId} = this.ctx.request.body;
      let user = await this.ctx.model.Users.findByPk(id);
      if (!user) {
        this.ctx.body = {status:416, msg:'error',tip:"非法请求！" }
        return;
       }
       let param = {}
       if(password && password.length<6){
          this.ctx.body = {status:416, msg:'error',tip:"密码不能为空且不能小于6位！" }
          return
       }else{
           param = {password:tools.cmd5(password.toString())}
       }
       if(roleId){
           const role = await this.ctx.model.Roles.findByPk(roleId);      
           if(role ){
              param.roleId = roleId
           }else{
              this.ctx.body = {status:416, msg:'error',tip:"非法角色！" }
              return
           }
       }
       if(Object.keys(param).length){
           await user.update(param)
           this.ctx.body = {status:200, msg:'success',tip:"用户修改成功！" }
           return
       }      
    } catch (error) {
       this.ctx.body = {status:416, msg:'error',tip:"非法请求！" }
    } 
  }
}

module.exports = UserController;
