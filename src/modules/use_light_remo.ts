import axios from "axios";

export const useLightRemo = async (buttonName: string): Promise<void> => {
  const remoToken = process.env.NATURE_REMO_TOKEN ?? '';
  const lightRemoId = process.env.LIGHT_REMO_ID ?? '';
  const apiBase = 'https://api.nature.global:443';

  const axiosClient = axios.create({
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

  const params = new URLSearchParams();
  params.append('button', buttonName);
  await axiosClient.post(`/1/appliances/${lightRemoId}/light`, params);
};
