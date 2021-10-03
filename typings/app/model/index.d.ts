// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCategory = require('../../../app/model/category');
import ExportRoleCategory = require('../../../app/model/roleCategory');
import ExportRoles = require('../../../app/model/roles');
import ExportTypes = require('../../../app/model/types');
import ExportUsers = require('../../../app/model/users');

declare module 'egg' {
  interface IModel {
    Category: ReturnType<typeof ExportCategory>;
    RoleCategory: ReturnType<typeof ExportRoleCategory>;
    Roles: ReturnType<typeof ExportRoles>;
    Types: ReturnType<typeof ExportTypes>;
    Users: ReturnType<typeof ExportUsers>;
  }
}
