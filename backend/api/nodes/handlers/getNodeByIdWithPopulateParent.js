const Node = require('../model');

const populateParent = async id =>
  Node.findById(id).then(
    node =>
      node.parent
        ? populateParent(node.parent).then(parent =>
            Object.assign(node, {
              parent
            })
          )
        : node
  );

module.exports = populateParent;
