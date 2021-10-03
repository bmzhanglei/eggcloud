'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs'); //这个库是 node.js API 各个方面的包装器 
const path = require('path');
const pump = require('mz-modules/pump');

class FileuploadController extends Controller {
   async fileAdd() {
        let { ctx } = this;
        let body = ctx.request.body;
        let file = ctx.request.files[0];
        if (file) {
            const filename = file.filename;
            // const targetPath = path.join('app/public/upload', filename);
            const targetPath = await this.ctx.service.tools.getUploadFile(filename);
            const source = fs.createReadStream(file.filepath);
            const target = fs.createWriteStream(targetPath);
            try {
                await pump(source, target);
            } finally {
                await ctx.cleanupRequestFiles();
            }
        }
        this.ctx.body = {
            body: body,
            file: file
        };
    }
    
    async fileAdds() {
        let { ctx } = this;
        let body = ctx.request.body; 
        const files = ctx.request.files; 
        try {
            for (const file of files) {               
                const filename = file.filename;
                // const targetPath = path.join('app/public/upload', filename);
                const targetPath = await this.ctx.service.tools.getUploadFile(filename);
                const source = fs.createReadStream(file.filepath);
                const target = fs.createWriteStream(targetPath);
                await pump(source, target);               
            }
        } finally {
           // delete those request tmp files 
           await ctx.cleanupRequestFiles();
        }
        this.ctx.body = {
            body: body,
            files: files 
        };
    }

    async fileAddCos() {
        const { ctx } = this;
        const body = ctx.request.body;
        //文件信息
        const file = ctx.request.files[0];
        if (file) {
            var source = fs.createReadStream(file.filepath);
            var filename = this.ctx.service.tools.getCosUploadFile(file.filename);
            //异步 改成 同步
            await this.ctx.service.tools.uploadCos(filename, source);
        }
        ctx.body = { link: this.config.cosUrl + "/" + filename };
    }

    async fileDelCos() {
        const { ctx } = this;
        const body = ctx.request.body; 
        const delInfo = await this.ctx.service.tools.deleteCos(body.paths);
        ctx.body = delInfo
    }

    // async showCode() {
    //     // var qr_svg = qr.image('http://www.itying.com', { type: 'png' });        
    //     // this.ctx.type = 'image/png';
    //     // this.ctx.body=qr_svg;
    //     /*
    //         1、生成图形二维码   
    //         2、把二维码上传到对象存储   返回一个二维码的地址
    //         3、生成图片二维码 （合成图片）
    //         4、图片二维码上传到对象存储
    //         5、页面上输出图片
    //     */
    //      const {ctx} = this 
    //     let id = ctx.request.query.id;
    //     // let table = await ctx.model.Table.findByPk(id);
    //     let qrImage=await ctx.service.tools.getQrImage('https://www.coderen.top?id='+id);
    //     let qrImageObj=await ctx.service.tools.uploadCos("code_1.png",qrImage)
    //     let canvasStream = await ctx.service.tools.getCanvasImage(
    //         '代码人生',
    //         'app/public/static/bg.png',
    //         "https://"+qrImageObj.Location
    //     )
    //     let canvasImageObj = await ctx.service.tools.uploadCos("code_image_1.png",canvasStream)
    //     this.ctx.body = {imgUrl:"https://"+canvasImageObj.Location}
    // }

    async showQrCode() {
         // var qr_svg = qr.image('http://www.itying.com', { type: 'png' });        
        // this.ctx.type = 'image/png';
        // this.ctx.body=qr_svg;
        /*
            1、生成图形二维码   
            2、把二维码上传到对象存储   返回一个二维码的地址
            3、生成图片二维码 （合成图片）html5 canvas          
        */
            let id = this.ctx.request.query.id;
            let qrImage=await this.ctx.service.tools.getQrImage('https://www.coderen.top?id='+id);    
            let qrImageObj=await this.ctx.service.tools.uploadCos("code_1.png",qrImage)
            this.ctx.body = {            
                text:'代码人生',
                bgSrc:'/public/static/bg.png',
                codeSrc:"https://"+qrImageObj.Location
            }
    }
}

module.exports = FileuploadController;