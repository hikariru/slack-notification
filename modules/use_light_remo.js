const axiosBase = require('axios');

const remoToken = process.env.NATURE_REMO_TOKEN;
const lightRemoId = process.env.LIGHT_REMO_ID;
const apiBase = 'https://api.nature.global:443';

module.exports = async (buttonName) => {
  const axios = axiosBase.create({
    baseURL: apiBase,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${remoToken}`,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
    },
    responseType: 'json'
  });

  try {
    let params = new URLSearchParams();
    params.append('button', buttonName);
    await axios.post(`/1/appliances/${lightRemoId}/light`, params);
  } catch (err) {
    throw err;
  }

};
