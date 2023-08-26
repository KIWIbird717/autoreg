import { logErrorToFile } from "../errorHandler";
import { promises as fs } from "fs";
import util from "util";

/**
 * Handling express error
 * @todo
 *
 * Access system
 */

interface ErrorWithStatus extends Error {
  status?: number;
}

const appendFileAsync = util.promisify(fs.appendFile);

function asyncWrapper(fn) {
  return function (req, res, next) {
    try {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        logErrorToFile(err, "express", "error");
        res.status(err.status || 500).send({ error: err.message });
      });
    } catch (err) {
      logErrorToFile(err, "express", "error");
      res.status(err.status || 500).send({ error: err.message });
    }
  };
}

export { asyncWrapper };
