import fs from "fs";
import path from "path";
import { bolt } from "./modules/bolt"
import Logger from "./modules/logger";

const listenersRoot = path.resolve('dist/', 'listeners') ;
fs.readdirSync(listenersRoot).forEach((directory: string) => {
  const directoryRoot = path.join(listenersRoot, directory);
  fs.readdirSync(directoryRoot).forEach((file: string) => {
    const extension = path.extname(file);
    if (extension !== ".js") {
      return;
    }
    const fullPath = path.join(directoryRoot, path.basename(file, extension));
    try {
      const script = require(fullPath);
      if (typeof script === 'function') {
        script();
        Logger.info(`Script has been loaded: ${fullPath}`)
      }
    } catch (err) {
      Logger.error(`Failed to load script: ${fullPath}`, err);
      throw err;
    }
  });
});

(async () => {
  await bolt.start(Number(process.env.PORT) || 3000);
  Logger.info('App is running!');
})();
