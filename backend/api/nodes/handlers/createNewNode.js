const Node = require('../model');

module.exports = async nodeData => new Node(nodeData).save();
