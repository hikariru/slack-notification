const PasswordCommand = require('../commands/password');

const PASSWORD_COMMAND_NAME = '/p';

module.exports = controller => {
  controller.on('slash_command', (bot, message) => {
    if (message.command === PASSWORD_COMMAND_NAME) {
      PasswordCommand(bot, message);
    }
  });
};
