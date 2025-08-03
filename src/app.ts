// 本番環境でない場合のみ.envファイルを読み込む
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./lib/config";
import { bolt } from "./lib/bolt";
import logger from "./lib/logger";

interface LoadedScript {
  path: string;
  success: boolean;
  error?: Error;
}

const loadScript = async (fullPath: string): Promise<LoadedScript> => {
  try {
    const script = await import(fullPath);
    if (typeof script.default === "function") {
      script.default();
      logger.debug(`Script has been loaded: ${fullPath}`);
      return { path: fullPath, success: true };
    } else if (typeof script === "function") {
      script();
      logger.debug(`Script has been loaded: ${fullPath}`);
      return { path: fullPath, success: true };
    }
    return { path: fullPath, success: false, error: new Error("No executable function found") };
  } catch (error) {
    return { path: fullPath, success: false, error: error as Error };
  }
};

const loadListeners = async (): Promise<void> => {
  const listenersRoot = path.resolve("dist/", "listeners");

  try {
    const directories = await fs.readdir(listenersRoot);
    const loadTasks = directories.map(async (directory) => {
      const directoryRoot = path.join(listenersRoot, directory);

      try {
        const files = await fs.readdir(directoryRoot);
        const jsFiles = files.filter((file) => path.extname(file) === ".js");

        return Promise.all(
          jsFiles.map((file) => {
            const fullPath = path.join(directoryRoot, path.basename(file, ".js"));
            return loadScript(fullPath);
          })
        );
      } catch (dirError) {
        logger.warn(`Failed to read directory: ${directoryRoot}`, dirError);
        return [];
      }
    });

    const results = await Promise.all(loadTasks);
    const flatResults = results.flat();

    // ロード結果のログ出力
    const successful = flatResults.filter((r) => r.success);
    const failed = flatResults.filter((r) => !r.success);

    logger.info(`Loaded ${successful.length} listeners successfully`);
    if (failed.length > 0) {
      failed.forEach((f) => logger.error(`Failed to load: ${f.path}`, f.error));
      throw new Error(`Failed to load ${failed.length} listeners`);
    }
  } catch (error) {
    logger.error("Critical error loading listeners:", error);
    throw error;
  }
};

const startApplication = async (): Promise<void> => {
  try {
    await loadListeners();
    await bolt.start(config.app.port);
    logger.info("App is running!");
  } catch (error) {
    logger.error("Failed to start application:", error);
    process.exit(1);
  }
};

startApplication();
