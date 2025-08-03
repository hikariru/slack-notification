import type express from "express";
import { receiver } from "../../lib/receiver";

export default () => {
  receiver.router.get("/", (_req: express.Request, res: express.Response) => {
    res.status(200).send("OK");
  });
};
