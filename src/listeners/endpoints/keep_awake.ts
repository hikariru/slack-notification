import express from "express";
import {Receiver} from "../../modules/receiver";

module.exports = () => {
  Receiver.router.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('OK');
  });
};
