import fs from 'fs'

import config from '../config'
import { login } from "./services/Solar";

import { getLatLong } from "./services/Weather/openWeather/getLatLon";
import { getThreeDayForecast } from './services/Weather/open-meteo';

const { vrm: { username, password } } = config

const main = async () => {
  const user = await login(username, password)
  console.log(user)

  const installations = await user.getInstallations()
  console.log(installations)

  // from = 28 days ago
  const start = Math.floor((Date.now() - 2419200000) / 1000)
  const end = Math.floor(Date.now() / 1000)
  console.log(start, end)

  const fromDate = new Date(start * 1000)
  console.log(fromDate)
  const solarHistory = await user.getSolarInputHistory(installations[0].id, { start, end })
  // console.log(solarHistory)

  const date = new Date()
  
  const formatted = formatTimestamp(solarHistory)
  console.log(formatted)
  // fs.writeFileSync(`data/solarInput/${date.toLocaleTimeString()}.json`, JSON.stringify(formatted, null, 2))


  const soc = await user.getSOCHistory(installations[0].id, { start, end })
  const formattedSoc = formatTimestamp(soc)

  // const SOC = await user.getCurrentSOC(installations[0].id)
  // console.log(SOC)

  // const solar = await user.getCurrentSolarInput(installations[0].id)
  // console.log(solar)

  // const consumption = await user.getCurrentConsumption(installations[0].id)
  // console.log(consumption)

  const latLong = await getLatLong('2440', 'AU')
  console.log(latLong)

  const forecast = await getThreeDayForecast(latLong)
  fs.writeFileSync(`data/solarRadiation/${date.toLocaleTimeString()}.json`, JSON.stringify(forecast, null, 2))
  

  // console.log(forecast)

  // // filter forecast to just the same day
  const filteredForecast = forecast.slice(0,24)
  console.log(filteredForecast)

  const objSolar = arrayToObject(formatted)
  const objSOC = arrayToObject(formattedSoc)

  console.log(objSolar)
  console.log(objSOC)

  const formattedForecast = forecast.map(value => {

    return {
      solarInput: objSolar[value.time],
      SOC: objSOC[value.time],
      ...value
    }
  })

  // console.log(formattedForecast)
  fs.writeFileSync(`data/all/${date.toLocaleTimeString()}.json`, JSON.stringify(formattedForecast, null, 2))



  // // calculate the average solar input for the next 24 hours
  // const averageSolarInput = filteredForecast.reduce((acc, forecast) => {
  //   return acc + forecast.solar
  // }, 0) / filteredForecast.length
  // console.log(averageSolarInput)


}

const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp*1000);

// Extract year, month, day, hour, and minute components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1 and pad with leading zero if needed
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  // const minute = String(date.getMinutes()).padStart(2, '0');
  const minute = '00'

  // Create the formatted date string
  const dateString = `${year}-${month}-${day}T${hour}:${minute}`;

  return dateString
}

const formatTimestamp = (history: { timestamp: number, value: number }[]) => {
  const formatted = {}
  history.forEach(({ timestamp, value }) => {
    const dateStamp = timestampToDate(timestamp)
    if (formatted[dateStamp]) {
      formatted[dateStamp].push(value)
      return
    }

    formatted[timestampToDate(timestamp)] = [value]
  })

  const result = Object.keys(formatted).map(key => {
    const values = formatted[key]
    const average = values.reduce((acc, value) => acc + value, 0) / values.length
    return { timestamp: key, value: average }
  })

  return result
}

const objectToArray = (object: { [key: string]: number }) => {
  return Object.keys(object).map(key => ({ timestamp: key, value: object[key] }))
}

const arrayToObject = (array: { timestamp: string, value: number }[]) => {
  return array.reduce((acc, { timestamp, value }) => {
    return { ...acc, [timestamp]: value }
  }, {})
}




main()