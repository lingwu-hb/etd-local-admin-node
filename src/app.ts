import { NodeClient } from "./node_client/node_client";
import Logger from "./logger";

(async () => {
  require("dotenv").config();
  let pjson = require("../package.json");
  global.version = pjson.version;
  Logger.info(`Current version: ${pjson.version}`);
  let node = new NodeClient({});
  await node.startApp();
})();
