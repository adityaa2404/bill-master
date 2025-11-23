const Item = require("../models/Item");

exports.createItem = (data) => {
  return Item.create(data);
};

exports.getItems = () => {
  return Item.find().sort({ name: 1 });
};

exports.getItemById = (id) => {
  return Item.findById(id);
};
