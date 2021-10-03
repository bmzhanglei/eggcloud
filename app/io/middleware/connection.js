
module.exports = app => { //connection
    return async (ctx, next) => {
        console.log("连接成功...")   
        // ctx.socket.emit('serverMsg', 'connected success-----');
        let params = ctx.socket.request.url.split("?")[1]
        let roomId = new URLSearchParams(params).get('roomId');
        //分组广播 获取客户端的地址 加入 socket    
        ctx.socket.join(roomId);
       
        await next(); 
    };
};