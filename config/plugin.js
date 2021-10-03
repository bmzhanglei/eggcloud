'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  static: {
    enable: true,
  },  
  redis:{
    enable:true,
    package:'egg-redis'
  },
  sequelize :{ 
    enable: true,
    package: 'egg-sequelize',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  jwt:{
    enable: true,
    package: "egg-jwt"
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  }
};
