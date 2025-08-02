import type express from "express";
import { receiver } from "../../modules/receiver";

export default () => {
  receiver.router.get("/", (_req: express.Request, res: express.Response) => {
    res.status(200).send("OK");
  });
};
