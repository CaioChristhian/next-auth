import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

import { signOut } from '../contexts/AuthContexts';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing = false;
let faildRequestsQueue: { onSuccess: (token: string) => void; onFailure: (err: AxiosError<any, any>) => void; }[] = [];

export function setupAPIClient(context: undefined | any) {
  let cookies = parseCookies(context);
 
  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['kuro.token']}`,
    },
  })
  
  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies(context)
  
        const { 'kuro.refreshToken': refreshToken } = cookies
        const originalConfig = error.config
  
        if (!isRefreshing) {
          isRefreshing = true
  
          api.post('/refresh', {
            refreshToken
          }).then(response => {
            const { token } = response.data
    
            setCookie(context, 'kuro.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            })
            
            setCookie(context, 'kuro.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            })
    
            api.defaults.headers['Authorization'] = `Bearer ${token}`
          
            faildRequestsQueue.forEach(request => request.onSuccess(token))
            faildRequestsQueue = []
          }).catch(err => {
            faildRequestsQueue.forEach(request => request.onFailure(err))
            faildRequestsQueue = []
  
            if (process.browser) {
              signOut()
            }
          }).finally(() => {
            isRefreshing = false
          })
        }
  
        return new Promise((resolve, reject) => {
          faildRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers!['Authorization'] = `Bearer ${token}`
            
              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        })
      } else {
        if (process.browser) {
          signOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }
  
    return Promise.reject(error)
  })

  return api
}