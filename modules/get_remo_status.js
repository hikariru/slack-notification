const axiosBase= require('axios');
const moment = require('moment-timezone');

const remoToken = process.env.NATURE_REMO_TOKEN;
const apiBase = 'https://api.nature.global:443';

module.exports = () => {
  const axios = axiosBase.create({
    baseURL: apiBase,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${remoToken}`
    },
    responseType: 'json'
  });

  axios.get('/1/devices')
    .then(res => {
      const temperature = res.data.newest_events.te;
      const createdAt = moment(temperature.created_at).tz(process.env.TIME_ZONE).format('YYYY-MM-DD HH:mm');
      return {
        value: temperature.value,
        createdAt: createdAt,
      };
    })
    .catch(err => {
      console.log('Nature Remo Cloud API returned a error', err);
    });
};
