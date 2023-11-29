import axios from 'axios'
import config from '../../../../config'

const { vrm: { api } } = config

interface InstallationsResponse {
  success: boolean;
  records: {
    idSite: string;
    name: string;
  }[]
}

export const getSystemInstallations = async (token: string, userId: string) => {
  const { data } = await axios.get<InstallationsResponse>(`${api}/users/${userId}/installations`, {
    headers: {
      'X-Authorization': `Bearer ${token}`
    }
  })

  return data.records.map(record => {
    return {
      id: record.idSite,
      name: record.name
    }
  })
}

export default getSystemInstallations