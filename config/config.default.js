/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
 const path = require('path');
 const {cosUrl,SecretId,SecretKey, Bucket,Region,corsOrigin, jwtKey,host,database, datapwd,sqlPort, sqlUsername,redisPort} = require('./configdata.js')
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    env: 'prod',
    rundir: '/tmp',
    logger: {
      dir: '/tmp',
    },
  };

  // console.log("process.env--->",process.env)

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1576384476895_3620';

  // add your user config here
  const userConfig = {
  
  };

  //静态资源访问
  config.static = {
    prefix:'/public/',
    dir: [path.join(appInfo.baseDir, 'app/public')]
  }

  //配置文件上传的模式
  config.uploadDir="app/public/upload";
  config.multipart = {
    mode: 'file',
    fields:20
  };

  //Cos域名 建议配置成自己的域名
  config.cosUrl = cosUrl;

  //配置cos 
  config.cosObject={SecretId,SecretKey, Bucket,Region }

  //配置csrf https://eggjs.org/zh-cn/core/security.html
  config.security = {
    csrf: { 
      enable: false,
      ignoreJSON: true,     
      // ignore: ctx => {
      //   return true
      //  if(ctx.request.url.indexOf("/api")!=-1){
      //     return true;
      //   }else{
      //     return false;
      //   }
      // },
    },
    domainWhiteList: [corsOrigin],  //注意：cors
  }
  //配置cors
  config.cors = {
    origin: corsOrigin,
    allowMethods: 'GET,PUT,POST,DELETE',
    credentials:true
  };

   // 配置中间件
   config.middleware = ["adminAuth"];
   config.adminAuth = {
    match(ctx) {
      const reg = /user|role|category/i;
      return reg.test(ctx.request.url);
    },
    //  match: `/user/editUser`,  //注意
    //  adminPath: config.adminPath,
     cosUrl: ""
   }

    //配置session 1633086648
    config.session = {
      key: 'SESSION_CLOUD_ID',
      maxAge: .25 * 3600 * 1000,   //0.5hour 如果过期时间比较长 建议保存在redis里面
      httpOnly: true,
      encrypt: true,
      renew: true // 延长会话有效期    
    }

  //配置jwt
  config.jwt = {
    secret: jwtKey
  };

  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: ["connection"],  //建立连接的时候触发方法
        packetMiddleware: [],
      }    
    },
  };
 
  config.redis={
    client: {
        port: redisPort, // Redis port
        host, // Redis host
        password: datapwd,
        db: 0,
      }
  }

  config.sequelize = { 
    dialect: 'mysql',
    timezone: '+08:00' , //保存为本地时区
     host,
     port: sqlPort, 
     database, 
     username:sqlUsername, 
     password:datapwd
  };

  return {
    ...config,
    ...userConfig,
  };
};
