import type { Application, Router } from "express";
import { asyncWrapper } from "./errorHandler";
import fs from "fs";
import path from "path";

/**
 * Reading folder "routes" and adding routes from that page 
 * 
 * How it work:
 * If you need to make folder "/test1/test"
 * Crete folder inside "routes" with name "test1", how it's look like:
 * 
 * routes/
 *  index.ts
 *  test1/
 *    test.ts
 */

const wrapRouteHandlers = (router: Router): void => {
  const routes = router.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route);

  routes.forEach((route) => {
    const methods = Object.keys(route.methods);

    methods.forEach((method) => {
      const originalHandler = route.stack[0].handle;
      route.stack[0].handle = asyncWrapper(originalHandler);
    });
  });
};

const registerRoutes = async (app: Application, dirPath: string, prefix: string = "/", callback?: () => void): Promise<void> => {
  const files = await fs.promises.readdir(dirPath);

  const filePromises = files.map(async (file) => {
    const filePath = path.join(dirPath, file);
    const isDirectory = (await fs.promises.stat(filePath)).isDirectory();

    if (isDirectory) {
      // Init routes inside folder
      await registerRoutes(app, filePath, path.join(prefix, file).replace(/\\/g, "/") + "/");
    } else {
      const routeModule = await import(filePath);
      const router = routeModule.default;
      
      if (router) {
        wrapRouteHandlers(router);
        app.use(prefix, router);
      } else {
        console.log("\x1b[33m", `[WARNING]: Wrong route ${filePath}`)
      }
    }
  });

  await Promise.all(filePromises);

  if (callback) {
    callback();
  }
};
export default registerRoutes;