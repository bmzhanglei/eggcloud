'use strict';

const Controller = require('egg').Controller;

class RolesController extends Controller {
  //查询角色下的所有用户
  async index() {
    const ctx = this.ctx;
    // ctx.body = await ctx.model.Roles.findAll({limit: 10, offset: 0,order:[["id","desc"]]});
  
    let result = await ctx.model.Roles.findAll({
        include:{model:ctx.model.Users}
    })
    ctx.body = {status:200,msg:"success",result}
  }

  //获取所有角色
  async getRoles() {
    const {ctx} = this   
    let result = await ctx.model.Roles.findAll({})
    ctx.body = {status:200,msg:"success",result}
  }

  //添加角色
  async addRole() {
    const { ctx } = this;
    const param = await this.getParam()   
    
    if(Object.keys(param).length){  
      if(param.tip){
        ctx.body={status:416,msg:"success",tip:param.tip};
        return
      }
       const role = await ctx.model.Roles.create({ created_at:new Date() ,...param});
       ctx.body={status:200,msg:"success",result:role};
    }else{
      ctx.body={status:416,msg:"error",tip:'名称非法！'};
    }   
  }

  //编辑角色
  async editRole(){
    const {ctx} = this   
    const {id} = ctx.request.body
    const role = await ctx.model.Roles.findByPk(parseInt(id))
    if(role){
      const param = await this.getParam()
      // console.log('----->',param)
      if(param){
        if(param.tip){
          ctx.body={status:416,msg:"success",tip:param.tip};
          return
        }
        await role.update({updated_at:new Date(),...param})
        ctx.body={status:200,msg:"success",tip:'角色修改成功！'};
      }
    }else{
      ctx.body={status:416,msg:"error",tip:'角色非法！'};
    }
  }

  async delRole(){
    const {ctx} = this;
    const {id} = ctx.request.body
    const role = await ctx.model.Roles.findByPk(id)
    if(!role){
        ctx.body = {status:416,msg:"error",tip:'删除失败！'};
        return 
    }
    await role.destroy()
    ctx.body={status:200,msg:"success",tip:'删除成功！'};
  }

  async getParam(){
    const { ctx } = this;
    let {name_cn,name_en} = ctx.request.body  
    // console.log('----->',name_en)    
    let param = {}
    if(name_cn) {
      let result = await ctx.model.Roles.findAll({where:{name_cn}})  
      if(result && result.length){  
        return {tip:'中文角色名称重复！'}
      }else{
        Object.assign(param,{name_cn:name_cn})
      }
    }
    
    if(name_en){
      let result = await ctx.model.Roles.findAll({where:{name_en}})  
      if(result && result.length){       
        return {tip:'英文角色名称重复！'}
      }else{
        Object.assign(param,{name_en:name_en})
      }
    } 

    return param
  }
}

module.exports = RolesController;
