const app = require("./app");
const seed = require("./src/scripts/seed");

seed.init().then(() => app.listen(3001));