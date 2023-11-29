import getGraph from "../getGraph"

interface Options {
  start?: string
  end?: string
}

interface ConsumptionData {
  29: [number, number][]
}

export const getConsumptionHistory = async (token: string, installationId: string, instance: string, options: Options) => {
  const data = await getGraph<ConsumptionData>(token, installationId, instance, 'OP1', options)
  return data.records.data['29'].map(([timestamp, value]) => ({ timestamp, value }))
}

export default getConsumptionHistory