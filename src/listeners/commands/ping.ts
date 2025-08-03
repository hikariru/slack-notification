import { bolt } from "../../lib/bolt";

export default () => {
  bolt.command("/ping", async ({ ack, say }) => {
    await ack();
    await say(`pong!`);
  });
};
