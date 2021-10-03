// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCategory = require('../../../app/controller/category');
import ExportFileupload = require('../../../app/controller/fileupload');
import ExportLogin = require('../../../app/controller/login');
import ExportRoles = require('../../../app/controller/roles');
import ExportUser = require('../../../app/controller/user');

declare module 'egg' {
  interface IController {
    category: ExportCategory;
    fileupload: ExportFileupload;
    login: ExportLogin;
    roles: ExportRoles;
    user: ExportUser;
  }
}
