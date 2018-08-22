const Node = require('../model');

const populateChildren = async id =>
  Node.findById(id).then(
    node =>
      node.children.length
        ? Promise.all(node.children.map(i => populateChildren(i))).then(children =>
            Object.assign(node, {
              children
            })
          )
        : node
  );

module.exports = populateChildren;
