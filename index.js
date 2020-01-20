const { router, get } = require("micro-fork");
const micro = require("micro");
const getProducts = require("./getProducts");

const handler = router()(get("/*", getProducts));
const server = micro(handler);
server.listen();
