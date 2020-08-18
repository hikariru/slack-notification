const useLightRemo = require('../../modules/use_light_remo');

const buttons = ['on', 'off', 'night']

module.exports = app => {
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
