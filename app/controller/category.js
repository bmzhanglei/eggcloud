'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  async index() {
    
  }
  async find() { //查找所有
    const { ctx } = this;
    const {typeId} = ctx.request.query
    const param =  await this.getTypeId()
    if(param.tip){
      ctx.body = {status:416, msg:'error',tip:param.tip }
      return
    }else{
      const result = await ctx.model.Category.findAll({where: {typeId} });
      ctx.body =  {status:200, msg:'success',result}
    }
  }     
  //添加
  async addCate() {
    const { ctx } = this;
    let {id,typeId,nameCn,
      nameEn,
      descriptionCn,
      descriptionEn,
      path,
      level,
      creator,
      pid,
      status,
      sort,isEdit,roleIds} = ctx.request.body
      const param =  await this.getTypeId()
    if(param.tip){
      ctx.body = {status:416, msg:'error',tip:param.tip }
      return
    }else{
        //判断父id下是否有重复的
          if(!pid){
            pid = null
          }      
           const result = await ctx.model.Category.findAll({where: {pid} });
           if(result.length){
              const flag = result.some(res=>res.nameCn === nameCn || res.nameEn === nameEn)
              if(flag){
                ctx.body = {status:416, msg:'error',tip: (nameCn || nameEn)+'和该父类下的子节点名称重复！' }
                return
              }
            }
            let params = {}
            const body = ctx.request.body
            console.log(body)
            for(let i in body){
              if(body[i]){
                params[i] = body[i]  
              }
            }
            params.createdAt = new Date()
            params.status = status == 0 ? 0 : 1 
            if(!level){
               if(pid==null){
                params.level = 1
               }else{
                 const caObj = await ctx.model.Category.findByPk(pid);
                 if(caObj){
                    params.level = 1 + caObj.level 
                 }else{
                   ctx.body = {status:416, msg:'error',tip: '传入的父节点pid有误！' }
                   return 
                 }
               }
            } 
            //
            let createId = ''
            if(isEdit){
              const cateObj = await ctx.model.Category.findByPk(id);
              if(cateObj){
                await cateObj.update(params);
              }else{
                ctx.body =  {status:416, msg:'error',tip:"传入的id有误！"} 
                return
              }
            }else{               
              createId = await ctx.model.Category.create(params)                      
            }

            //该菜单项给角色赋权限
             if(roleIds){
                 //先删除                 
                 const arr = roleIds.split(',')   
                 const cId = createId?createId.id:id     
                  await ctx.model.RoleCategory.destroy({where:{cateId:cId}})
                  const allData = []
                  arr.forEach(async item => {    
                    allData.push({roleId:item,cateId:cId})      
                  });               
                  await ctx.model.RoleCategory.bulkCreate(allData)                  
             }
            ctx.body =  {status:200, msg:'success',tip:`${isEdit?"修改":"保存"}成功！`} 
    }
  }

  //删除
  async delCate() {
    //先删除赋予权限的page表
    const { ctx } = this;
    let {id} = ctx.request.body

    let transaction ;
    try{
      transaction = await this.ctx.model.transaction();
      const data = await ctx.model.Category.findAll({where:{pid:id},transaction})
      if(data.length>0){
        ctx.body =  {status:416, msg:'error',tip:`该节点下有子节点，请先删除子节点！`} 
        return
      }
      let cr = await ctx.model.RoleCategory.destroy({where:{cateId:id},transaction})
      let c = await ctx.model.Category.destroy({where:{id},transaction})
      if(c==0){
        await transaction.rollback()
        ctx.body =  {status:416, msg:'success',tip:`删除失败！`}
      }else{
        await transaction.commit()        
        ctx.body =  {status:200, msg:'success',tip:`删除成功！`}
      }
    }catch(e){
        await transaction.rollback()
    }

   
    
  }

  async getTypeId(){
    const { ctx } = this;
    const {typeId} = ctx.request.body
    let param  = {}
    if(!typeId){       
      param = {tip:"请传入正确的typeId！" }
    }else{
      const types = await ctx.model.Types.findByPk(typeId);
      if(!types){
        param = {tip:"请传入正确的typeId！" }
      }   
    } 
    return param
  }
  
}

module.exports = CategoryController;
