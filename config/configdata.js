let obj = {
    cosUrl : "https://images-14444444.cos.ap-guangzhou.myqcloud.com",
    SecretId: 'AKID6ez3qsfasfasfasfdsfdLTJsABvOaVAX',
    SecretKey: '7xXsdfsdfXJs99sdfsdfsfsfT',
    Bucket:"images-12900867492",
    Region:"ap-shenzhen",
    corsOrigin:"http://www.xxx.com",
    jwtKey: "哈哈-绝密的东西",
    host: process.env.NODE_ENV==="development"?'101.38.111.233':'127.0.0.1',
    database:"data",
    datapwd:"*****",
    sqlPort:3306,
    sqlUsername:"username",
    redisPort:6379
}


module.exports = obj