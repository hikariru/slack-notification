import { bolt } from "../../modules/bolt";

export default () => {
  bolt.command("/ping", async ({ ack, say }) => {
    await ack();
    await say(`pong!`);
  });
};
