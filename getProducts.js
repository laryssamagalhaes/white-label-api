const productsFromDb = require("./products.json");
const get = require("lodash/get");
const _ = require("lodash");
const queryString = require("query-string");
const { send } = require("micro");
const cors = require("micro-cors")();

const getfilterProductsByName = name => {
  const lowerCaseName = name.toLowerCase();

  return product => {
    if (!name) return true;

    return product.name.toLowerCase().includes(lowerCaseName);
  };
};

const handler = async (req, res) => {
  const { priceOrder = "desc", name = "", size, page } = queryString.parse(
    req.url.substring(1)
  );
  const filterProductByName = getfilterProductsByName(name);
  const products = _.chain(productsFromDb)
    .filter(filterProductByName)
    .orderBy("price", priceOrder)
    .chunk(size)
    .value();

  const statusCode = 200;
  const data = {
    currentPage: parseInt(page),
    products: get(products, `[${page - 1}]`, []),
    pages: products.length
  };

  send(res, statusCode, data);
};

module.exports = cors(handler);
