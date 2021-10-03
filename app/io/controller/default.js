'use strict';
const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async index() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    
    console.log("ClientMsg:",message);

    //广播给自己
    // await ctx.socket.emit('serverMsg', `Hi! I've got your message: ${message}`);

    //广播给所有人
    // await app.io.emit('serverMsg', `Hi! I've got your message: ${message+Math.random()}`);
    console.log('ctx.request.body--->',ctx.request)
    let params = ctx.socket.request.url.split("?")[1]
    //分组广播
    let roomId = new URLSearchParams(params).get('roomId');
    //对房间（分组）内的用户广播消息
    // app.io.to(roomId).emit("serverMsg","this is addCart msg--"+roomId);  
    //通知分组内的用户不包括自己
    ctx.socket.broadcast.to(roomId).emit('serverMsg','this is addCart msg---'+roomId); 
  }
}

module.exports = DefaultController;
