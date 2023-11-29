import axios from 'axios'
import config from '../../../config'
import User from './User'

const { vrm: { api } } = config

interface LoginResponse {
  token: string;
  idUser: string;
}

export const login = async (username: string, password: string) => {
  const { data } = await axios.post<LoginResponse>(`${api}/auth/login`, {
    username,
    password
  })

  const user = new User(data.idUser, data.token)

  return user
}

export default login