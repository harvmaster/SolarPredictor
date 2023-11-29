import getConsumptionHistory from "./getConsumptionHistory";

export const getCurrentConsumption = async (token: string, installationId: string, instance: string) => {
  const history = await getConsumptionHistory(token, installationId, instance, { start: (Date.now() / 1000 - 60 * 60).toString() })
  const current = history[history.length - 1]

  return current
}

export default getCurrentConsumption