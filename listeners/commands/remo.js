const getRemoStatus = require('../../modules/get_remo_status');

module.exports = app => {
  app.command(`/remo`, async ({command, ack, say}) => {
    await ack();

    try {
      const remoStatus = await getRemoStatus();
      await say(`現在の室温は ${remoStatus.value}℃です :thermometer:`);
    } catch (err) {
      console.log(err);
    }
  });
};
