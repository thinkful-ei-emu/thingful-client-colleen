import config from '../config'
import TokenService from './token-service'
import IdleService from './idle-service'

const AuthApiService = {
  postLogin(credentials){
    return fetch(`${config.API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    .then(res=>
      (!res.ok)
      ? res.json().then(e=>Promise.reject(e))
      : res.json()
      )
    .then(res=> {
      //when login--save token, queue idle logout, queue refresh call
      TokenService.saveAuthToken(res.authToken)
      IdleService.registerIdleTimerResets()
      TokenService.queueCallbackBeforeExpiry(()=> {
        AuthApiService.postRefreshToken()
      })
      return res
    })
  },
  postUser(user){
    return fetch(`${config.API_ENDPOINT}/users`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user)
    })
    .then(res=>
      (!res.ok)
      ? res.json().then(e=>Promise.reject(e))
      : res.json())
  },
  postRefreshToken(){
    return fetch(`${config.API_ENDPOINT}/auth/refresh`, {
      'authorization': `Bearer ${TokenService.getAuthToken()}`
    })
    .then(res => {
      //error catching here, queueing cb, saving token
      TokenService.saveAuthToken(res.authToken)
      TokenService.queueCallbackBeforeExpiry(()=>{
        AuthApiService.postRefreshToken()
      })
      return res
    })
    .catch(err => {
      console.log('refresh token request error')
      console.error(err)
    })
  }
}

export default AuthApiService