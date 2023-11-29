import axios from 'axios'
import config from '../../../config'

const { vrm: { api } } = config

interface Options {
  start?: string
  end?: string
}

interface Graph<T> {
  success: boolean
  records: {
    data: T
  }
}

export const getGraph = async <T>(token: string, installationId: string, instance: string, attributeCodes: string | string[], options: Options): Promise<Graph<T>> => {
  options.start ?? (options.start = (Date.now() / 1000 - 60 * 60 * 24).toString())
  options.end ?? (options.end = (Date.now() / 1000).toString())

  if (typeof attributeCodes === 'string') {
    attributeCodes = [attributeCodes]
  }

  // console.log('get graph: ', attributeCodes, installationId, instance, token)

  const { data } = await axios.get<Graph<T>>(`${api}/installations/${installationId}/widgets/Graph`, {
    params: {
      attributeCodes,
      start: options.start,
      end: options.end,
      instance
    },
    headers: {
      'X-Authorization': `Bearer ${token}`
    }
  }).catch(error => {
    console.log(error)
    throw error
  })

  return data

}

export default getGraph