import { getConsumptionHistory, getCurrentConsumption } from "./consumption";
import { getSOCHistory, getCurrentSOC } from "./battery";
import { getSolarInputHistory, getCurrentSolarInput } from "./solar";
import { getSystemInstallations, getSystemOverview } from './installations';

class User {
  id: string;
  accessToken: string;
  installations?: {
    id: string;
    name: string;
    solar?: string;
    battery?: string;
  }[];

  constructor(id, accessToken) {
    this.id = id
    this.accessToken = accessToken
  }

  getId() {
    return this.id
  }

  async getInstallations () {
    const installations = await getSystemInstallations(this.accessToken, this.id)
    if (!installations) {
      throw new Error('No installations found')
    }
    this.installations = installations.map(installation => {
      return {
        id: installation.id,
        name: installation.name
      }
    })
    return this.installations
  }

  async getOverview (installationId) {
    const installation = this.installations?.find(installation => installation.id === installationId)
    if (!installation) {
      throw new Error('No installation found')
    }
    const overview = await getSystemOverview(this.accessToken, installationId)
    if (!overview) {
      throw new Error('No overview found')
    }
    
    installation.solar = overview.solarInstance
    installation.battery = overview.batteryInstance

    return installation
  }

  async getCurrentSOC (installationId) {
    let installation = this.installations?.find(installation => installation.id === installationId)
    if (!installation) throw new Error('No installation found')
    if (!installation?.battery) {
      await this.getOverview(installationId)
    }

    return await getCurrentSOC(this.accessToken, installationId, installation.battery)
  }

  async getCurrentSolarInput (installationId) {
    let installation = this.installations?.find(installation => installation.id === installationId)
    if (!installation) throw new Error('No installation found')
    if (!installation?.solar) {
      await this.getOverview(installationId)
    }

    return await getCurrentSolarInput(this.accessToken, installationId, installation.solar)
  }

  async getCurrentConsumption (installationId) {
    return await getCurrentConsumption(this.accessToken, installationId, "0")
  }

  async getSOCHistory (installationId, options) {
    let installation = this.installations?.find(installation => installation.id === installationId)
    if (!installation) throw new Error('No installation found')
    if (!installation?.battery) {
      await this.getOverview(installationId)
    }

    return await getSOCHistory(this.accessToken, installationId, installation.battery, options)
  }

  async getSolarInputHistory (installationId, options) {
    let installation = this.installations?.find(installation => installation.id === installationId)
    if (!installation) throw new Error('No installation found')
    if (!installation?.solar) {
      await this.getOverview(installationId)
    }

    return await getSolarInputHistory(this.accessToken, installationId, installation.solar, options)
  }
}

export default User