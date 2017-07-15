const PasswordGenerator = require('../commands/password_generator');

module.exports = controller => {
  controller.on('slash_command', (bot, message) => {
    console.log(message.command);
    if (message.command === 'pass') {
      PasswordGenerator(bot, message);
    }
  });
};
