import axios from 'axios'
import config from '../../../../config'

const { vrm: { api } } = config

interface SystemOverviewResponse {
  success: boolean;
  records: {
    devices: {
      name: string;
      instance: string;
    }[]
  }
}

export const getSystemOverview = async (token: string, installation: string) => {
  const { data } = await axios.get<SystemOverviewResponse>(`${api}/installations/${installation}/system-overview`, {
    headers: {
      'X-Authorization': `Bearer ${token}`
    }
  })

  // get Solar instance
  const solarInstance = data.records.devices.find(record => record.name === 'Solar Charger')

  // get Battery instance
  const batteryInstance = data.records.devices.find(record => record.name === 'Battery Monitor')

  const overview = {
    solarInstance: solarInstance?.instance,
    batteryInstance: batteryInstance?.instance
  }

  return overview
}

export default getSystemOverview