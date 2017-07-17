const PasswordGenerator = require('../commands/password_generator');

module.exports = controller => {
  controller.on('slash_command', (bot, message) => {
    switch (message.command) {
      case "/pass":
        if (message.token !== process.env.VERIFICATION_TOKEN) return;
        PasswordGenerator(bot, message);
        break;
      default:
        slashCommand.replyPublic(message, `I'm afraid I don't know how to ${message.command} yet.`);
    }
  });
};
