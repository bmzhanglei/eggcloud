'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
 // 构建树形结构数据
 buildTree(data) {
    const res = [];
    // 找出所有根结点
    for (const item of data) {
      if (!item.pid) {
        item.children = getNode(item.id);
        res.push(item);
      }
    }
    // 传入根结点id 递归查找所有子节点
    function getNode(id) {
      const node = [];
      for (const item of data) {
        if (item.pid === id) {
          item.children = getNode(item.id);
          node.push(item);
        }
      }
      if (node.length === 0) return;
      return node;
    }
    return res;
  }
}

module.exports = CategoryService;
