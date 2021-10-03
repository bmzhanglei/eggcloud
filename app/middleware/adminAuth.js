module.exports = (options,app) => {
    return async function adminAuth(ctx,next){    
        // console.log('中间件：-----》')
        // console.log(options)
        // console.log(ctx)
        if(ctx.session.userinfo&&ctx.session.userinfo.username){
            let token = await app.redis.get(ctx.session.userinfo.username)
            //解码
            // let decode = app.jwt.verify(token, options.secret);//验证token
            // console.log('decode======>', decode);
            if(token && token === ctx.session.token){
                await next();
            }else{
                ctx.session.userinfo=null;
                ctx.session.code = null
                ctx.session.token = null
                ctx.body = {status:666,msg:"error",tip:"token失效！请退出重新登陆！"}  
            }
        }else{
            ctx.session.userinfo=null;
            ctx.session.code = null
            ctx.session.token = null
            ctx.body = {status:416,msg:"error",tip:"用户未登陆！"}
        }        
    }
}