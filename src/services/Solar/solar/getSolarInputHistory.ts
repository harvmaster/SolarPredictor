import getGraph from "../getGraph"

interface Options {
  start?: string
  end?: string
}

interface SolarInputData {
  442: [number, number][]
}

export const getSolarInputHistory = async (token: string, installationId: string, instance: string, options: Options) => {
  const data = await getGraph<SolarInputData>(token, installationId, instance, 'PVP', options)
  // console.log(data)
  return data.records.data['442'].map(([timestamp, value]) => ({ timestamp, value }))
}

export default getSolarInputHistory

