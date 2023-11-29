import getSolarInputHistory from "./getSolarInputHistory";

export const getCurrentSolarInput = async (token: string, installationId: string, instance: string) => {
  const history = await getSolarInputHistory(token, installationId, instance, { start: (Date.now() / 1000 - 60 * 60).toString() })
  const current = history[history.length - 1]

  return current
}

export default getCurrentSolarInput