const PasswordGenerator = require('../commands/password_generator');

const PASSWORD_GENERATOR_COMMAND = '/pass';

module.exports = controller => {
  controller.on('slash_command', (bot, message) => {
    if (message.command === PASSWORD_GENERATOR_COMMAND) {
      PasswordGenerator(bot, message);
    }
  });
};
