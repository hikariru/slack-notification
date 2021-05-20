import {App, ExpressReceiver} from '@slack/bolt';

module.exports = (app: App, receiver: ExpressReceiver) => {
  app.command(`/ping`, async ({command, ack, say}) => {
    await ack();
    await say('pong!');
    return;
  })
};
