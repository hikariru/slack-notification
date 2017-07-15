const generator = require('generate-password');

module.exports = (bot, message) => {
  const password = generator.generate({
    length: 12,
    numbers: true,
    symbols: false,
    uppercase: true,
    excludeSimilarCharacters: true,
    strict: true
  });

  bot.replyPublic(message, `Generated: ${password}`);
};