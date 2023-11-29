import getGraph from "../getGraph"

interface Options {
  start?: string
  end?: string
}

interface BatterySOCData {
  51: [number, number][]
}

export const getSOCHistory = async (token: string, installationId: string, instance: string, options: Options) => {
  const data = await getGraph<BatterySOCData>(token, installationId, instance, 'SOC', options)
  return data.records.data['51'].map(([timestamp, value]) => ({ timestamp, value }))
}

export default getSOCHistory