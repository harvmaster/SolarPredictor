import axios from 'axios'
import config from '../../../../config' 

interface LatLonResponse {
  zip: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export const getLatLong = async (postCode: string, country: string) => {
  const { data } = await axios.get<LatLonResponse>(`${config.openWeatherAPI}/geo/1.0/zip?zip=${postCode},${country}&appid=${config.openWeatherKey}`)
  return {
    lat: data.lat,
    lon: data.lon
  }
}

export default getLatLong