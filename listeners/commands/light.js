const useLightRemo = require('../../modules/use_light_remo');

const buttons = ['on', 'off', 'night']

module.exports = app => {
  app.command(`/light`, async ({command, ack, say}) => {
    await ack();

    try {
      const button = command.text;
      if (!buttons.includes(button)) {
        await say('ポチッと…そんなボタンないですね');
        return;
      }

      await useLightRemo(button);
      await say('ポチッとな！');
    } catch (err) {
      console.log(err);
      await say('ポチッと…あれ？ダメみたいです');
    }
  });
};
