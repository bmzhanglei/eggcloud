'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {

   async test(){
       const {ctx,app} = this
       const name = await app.redis.get('username')
       console.log(ctx.request.header)
      //  app.redis.set('username','haha')
       ctx.body = ctx.request.header
   }

  async doLogin() {
    const {ctx,app} = this
    let {username,password,verify} = ctx.request.body
    password = ctx.service.tools.cmd5(password)
    console.log('ctx.session.code----->', ctx.session)
    if(verify == ctx.session.code){
        // console.log('----->')
        let userinfo = await ctx.model.Users.findAll({
            where: {
              username: username,
              password:password
            }
        });       
        if(userinfo.length>0){       
            const userinfo_login =  userinfo[0].dataValues
            ctx.session.userinfo = userinfo_login;  
            ctx.session.token = app.jwt.sign({ userinfo_login}, app.config.jwt.secret,{
                expiresIn:60*60*.5  //设置半小时
             });        
             await app.redis.set(userinfo_login.username,ctx.session.token)     
             ctx.body = {status:200,msg:"success"}
        }else{
            ctx.body = {status:416,msg:"error",tip:"用户名或者密码错误！"}
        }
    }else{
        ctx.body = {status:416,msg:"error",tip:"验证码错误！"}
    }    
  }

  async loginOut(){
    this.ctx.session.userinfo=null;
    this.ctx.session.code = null
    this.ctx.session.token = null
    this.ctx.body = {status:200,msg:"success",tip:'退出登陆成功！'}
  }

  async captcha() {    
    let captcha = await this.service.tools.getCaptcha();
    // console.log(captcha.text);
    this.ctx.session.code = captcha.text;
    this.ctx.response.type = 'image/svg+xml'; /*指定返回的类型*/ 
    this.ctx.body = captcha; /*给页面返回一张图片*/

  }
}

module.exports = LoginController;
