import {useLightRemo} from '../../modules/use_light_remo';
import {App, ExpressReceiver} from '@slack/bolt';

module.exports = (app: App, receiver: ExpressReceiver) => {
  const buttons = ['on', 'off', 'night']
  app.command(`/light`, async ({command, ack, say}) => {
    await ack();

    try {
      const buttonName = command.text;
      if (!buttons.includes(buttonName)) {
        await say('ポチッと…そんなボタンないですね');
        return;
      }

      await useLightRemo(buttonName);
      await say(`ええと、${buttonName}ボタンは… ポチッとな！`);
    } catch (err) {
      console.error(err);
      await say('ポチッと…あれ？ダメみたいです');
    }
  });
};
