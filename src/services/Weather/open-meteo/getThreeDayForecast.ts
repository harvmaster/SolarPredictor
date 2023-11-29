import axios from 'axios'
import config from '../../../../config'

const { openMeteo: { api } } = config

interface Location {
  lat: number
  lon: number
}

interface ThreeDayForecast {
  time: string;
  temperature: number;
  cloudCoverage: number;
  solar: number;
}

interface OpenMeteoForecast {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    cloud_cover: number[];
    direct_radiation: number[];
    precipitation_probability: number[];
    rain: number[];
    showers: number[];
    visibility: number[];
    uv_index: number[];
  };
  hourly_units: {
    temperature_2m: string;
  };
}

export const getThreeDayForecast = async (location: Location): Promise<ThreeDayForecast[]> => {
  const { lat: latitude, lon: longitude } = location;

  const response = await axios.get<OpenMeteoForecast>(`${api}/forecast`, {
    params: {
      latitude: latitude,
      longitude: longitude,
      hourly: 'temperature_2m,cloud_cover,direct_radiation,precipitation_probability,rain,showers,visibility,uv_index',
      past_days: 31,
      timezone: 'Australia/Sydney',
      start: new Date().toISOString().split('T')[0], // Start from today
      end: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0] // End after 3 days
    }
  });

  return response.data.hourly.time.map((time: string, index: number) => ({
    time: time,
    temperature: response.data.hourly.temperature_2m[index],
    cloudCoverage: response.data.hourly.cloud_cover[index],
    solar: response.data.hourly.direct_radiation[index],
    precipitation_probability: response.data.hourly.precipitation_probability[index],
    rain: response.data.hourly.rain[index],
    showers: response.data.hourly.showers[index],
    visibility: response.data.hourly.visibility[index],
    uv_index: response.data.hourly.uv_index[index]
  }));
}

export default getThreeDayForecast