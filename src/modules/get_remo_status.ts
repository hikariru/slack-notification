import axios from "axios";
import moment from "moment-timezone";

export const getRemoStatus = async() => {
  const remoToken = process.env.NATURE_REMO_TOKEN;
  const apiBase = 'https://api.nature.global:443';
  const axiosClient = axios.create({
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
    const res = await axiosClient.get('/1/devices');
    const temperature = res.data[0].newest_events.te;
    const humidity = res.data[0].newest_events.hu;
    const timezone = process.env.TIMEZONE ?? '';
    const createdAt = moment(temperature.created_at).tz(timezone).format('YYYY-MM-DD HH:mm');
    return {
      temperature: Math.round(temperature.val),
      humidity: humidity.val,
      createdAt: createdAt,
    };
  } catch(err) {
    console.log('Nature Remo Cloud API returned a error', err);
  }

};
