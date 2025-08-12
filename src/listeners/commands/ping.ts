import { bolt } from "../../lib/bolt";

export default () => {
  bolt.command("/ping", async ({ ack, respond }) => {
    await ack();
    await respond(`pong!`);
  });
};
