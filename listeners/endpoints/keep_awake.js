module.exports = app => {
  app.receiver.router.get(`/`, (req, res) => {
    res.status(200).send('OK');
  });
};
