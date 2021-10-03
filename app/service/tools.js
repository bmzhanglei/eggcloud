'use strict';

const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');
const md5 = require('md5');
const sd = require('silly-datetime');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');
const COS = require('cos-nodejs-sdk-v5');
var qr = require('qr-image');
// const { createCanvas, Image } = require('canvas')
const fs = require('fs')

class ToolsService extends Service {
  async getCaptcha() {
    //生成图形验证码
    var captcha = svgCaptcha.createMathExpr({
      size: 4,
      fontSize: 40,
      width: 120,
      height: 32,
      background: "#cc9966"
    });

    return captcha;
  }  
  cmd5(msg) {    
    return md5(msg)
  }
  getUnixTime(){
    let dObj=new Date();
    return dObj.getTime()/1000;
  }
  async getUploadFile(filename){
    //1、获取当前日期 20210920
    let day=sd.format(new Date(), 'YYYYMMDD');
    //2、创建文件保存的路径
    // app/public/upload/20210920
    let dir=path.join(this.config.uploadDir,day);    
    await mkdirp(dir);
    //3、生成文件名称  获取文件保存的目录   以前的文件 serverless_600x900.png    20210920.png
    let d=this.getUnixTime();
    //  app/public/upload/20210920/4124215212.png
    let saveDir=path.join(dir,d+path.extname(filename));
    console.log(saveDir);
    return saveDir;
  }
  getCosUploadFile(filename) {
    //1、获取当前日期 20210920
    let dir = sd.format(new Date(), 'YYYYMMDD');
    //2、生成文件名称  获取文件保存的目录   以前的文件 serverless_600x900.png    20210920.png
    let d = this.getUnixTime();
    //20210412/1618196478.png
    let saveDir = dir + "/" + d + path.extname(filename);
    return saveDir;  
  }

  async uploadCos(filename, body) {
    //配置请参考  config/config.default.js
    let cos = new COS({
      SecretId: this.config.cosObject.SecretId,
      SecretKey: this.config.cosObject.SecretKey
    });
    return new Promise((reslove, reject) => {
      cos.putObject({
        Bucket: this.config.cosObject.Bucket, /* 必须 */
        Region: this.config.cosObject.Region,    /* 必须 */
        Key: filename,              /* 必须 */
        StorageClass: 'STANDARD',
        Body: body, // 上传文件对象
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData));
        }
      }, function (err, data) {
        if (!err) {
          reslove(data)
        } else {
          reject(err);
        }
      });
    })
  }

  async deleteCos(filename) {
    //配置请参考  config/config.default.js
    let cos = new COS({
      SecretId: this.config.cosObject.SecretId,
      SecretKey: this.config.cosObject.SecretKey
    });

    return new Promise((reslove, reject) => {
      cos.deleteObject({
        Bucket: this.config.cosObject.Bucket, /* 必须 */
        Region: this.config.cosObject.Region,    /* 必须 */
        Key: filename       /* 必须 */
      }, function (err, data) {
        if (!err) {
          reslove(data)
        } else {
          reject(err);
        }
      });
    })
  }

    //获取图形二维码
    async getQrImage(qrText) {
      return new Promise((reslove, reject) => {
        try {
          var qrImage = qr.image(qrText, { type: 'png' });
          reslove(qrImage)
        } catch (error) {
          reject(false);
        }  
      })
    }

    //合成图片
  // async getCanvasImage(text,bgDir,codeDir) {
  //   return new Promise((reslove, reject) => {
  //     try {
  //       const canvas = createCanvas(501, 730)
  //       const ctx = canvas.getContext('2d');
  //       //绘制背景图片
  //       const img1 = new Image();
  //       img1.onload = () => {
  //         ctx.drawImage(img1, 0, 0);
  //         //填充文字  注意字体
  //         ctx.font = '30px "Microsoft YaHei"'
  //         ctx.fillStyle = "#ffffff";
  //         ctx.fillText(text, 170, 320);
  //         const img2 = new Image();
  //         img2.onload = () => {
  //           ctx.drawImage(img2, 150, 340);
  //           //canvas.createPNGStream().pipe(fs.createWriteStream("app/public/static/out.png"));
  //           reslove(canvas.createPNGStream());
  //         }
  //         img2.onerror = err => {
  //           //  throw err 
  //            reject(err);
  //         }
  //         //需要注意顺序
  //         img2.src = codeDir;
  //       }
  //       img1.onerror = err => { reject(err); }
  //       //需要注意顺序
  //       img1.src =bgDir;
  //     } catch (error) {
  //       reject(false);
  //     }
  //   })
  // }
}

module.exports = ToolsService;
