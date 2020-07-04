const axiosBase= require('axios');
const moment = require('moment-timezone');

const remoToken = process.env.NATURE_REMO_TOKEN;
const apiBase = 'https://api.nature.global:443';

module.exports = async() => {
  const axios = axiosBase.create({
    baseURL: apiBase,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${remoToken}`,
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
    },
    responseType: 'json'
  });

  try {
    const res = await axios.get('/1/devices');
    const temperature = res.data[0].newest_events.te;
    const createdAt = moment(temperature.created_at).tz(process.env.TIMEZONE).format('YYYY-MM-DD HH:mm');
    return {
      value: temperature.val,
      createdAt: createdAt,
    };
  } catch(err) {
    console.log('Nature Remo Cloud API returned a error', err);
  }

};
