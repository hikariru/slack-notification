const axios = require('axios');
const endpoint = 'http://weather.livedoor.com/forecast/webservice/json/v1';
const cityId = "130010";

module.exports = async () => {
  try {
    const res = await axios.get(endpoint, {params: {'city': cityId}});
    return res.data;
  } catch (err) {
    console.log('Weather Hack API returned a error', err);
  }
};
