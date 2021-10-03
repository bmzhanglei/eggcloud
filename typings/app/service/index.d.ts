// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportCategory = require('../../../app/service/category');
import ExportSpider = require('../../../app/service/spider');
import ExportTools = require('../../../app/service/tools');

declare module 'egg' {
  interface IService {
    category: AutoInstanceType<typeof ExportCategory>;
    spider: AutoInstanceType<typeof ExportSpider>;
    tools: AutoInstanceType<typeof ExportTools>;
  }
}
