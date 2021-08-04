import { App } from "../../modules/bolt";

module.exports = () => {
  App.command('/ping', async ({ack, say}) => {
    await ack();
    await say(`pong!`);
  })
};
