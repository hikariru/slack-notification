import { bolt } from "../../modules/bolt";

module.exports = () => {
  bolt.command('/ping', async ({ack, say}) => {
    await ack();
    await say(`pong!`);
  })
};
