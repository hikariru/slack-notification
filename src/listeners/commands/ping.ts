import {App, ExpressReceiver} from '@slack/bolt';

module.exports = (app: App, receiver: ExpressReceiver) => {
  app.command('ping', async ({command, ack, say}) => {
    console.log(command);
    await ack();
    await say(`<@${command.user_id}> pong!'`);
    return;
  })
};
