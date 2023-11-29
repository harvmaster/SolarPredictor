import getBatterySOC from './getSOCHistory'

export const getCurrentSOC = async (token: string, installationId: string, instance: string) => {
  const batterySOC = await getBatterySOC(token, installationId, instance, { start: (Date.now() / 1000 - 60 * 60).toString(), end: (Date.now() / 1000).toString() })
  const currentSOC = batterySOC[batterySOC.length - 1]

  return currentSOC
}

export default getCurrentSOC