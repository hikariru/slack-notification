import {App, ExpressReceiver} from '@slack/bolt';
import express from "express";

module.exports = (app: App, receiver: ExpressReceiver) => {
  receiver.router.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('OK');
  });
};
