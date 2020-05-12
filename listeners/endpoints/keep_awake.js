module.exports = app => {
  app.receiver.app.get(`/`, (req, res) => {
    res.status(200).send('OK');
  });
};
