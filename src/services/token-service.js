import config from '../config'
import jwtDecode from 'jwt-decode'

let _timeoutId 
const _TEN_SECONDS_IN_MS = 10000

const TokenService = {
  saveAuthToken(token) {
    window.localStorage.setItem(config.TOKEN_KEY, token)
  },
  getAuthToken() {
    return window.localStorage.getItem(config.TOKEN_KEY)
  },
  clearAuthToken() {
    console.info('clearing the auth token')
    window.localStorage.removeItem(config.TOKEN_KEY)
  },
  hasAuthToken() {
    return !!TokenService.getAuthToken()
  },
  makeBasicAuthToken(userName, password) {
    return window.btoa(`${userName}:${password}`)
  },
  parseJwt(jwt){
    return jwtDecode(jwt)
  },
  readJwtToken(){
    return TokenService.parseJwt(TokenService.getAuthToken())
  },
  _getMsUntilExpiry(payload){
    return (payload.exp * 1000) - Date.now()
  },
  queueCallbackBeforeExpiry(callback){
    //get ms now until token exp
    const msUntilExpiry = TokenService._getMsUntilExpiry(
      TokenService.readJwtToken()
    )
    //queue cb 10 sec before token exp-here cb is calling refrehs
    _timeoutId = setTimeout(callback, msUntilExpiry - _TEN_SECONDS_IN_MS)
  },
  clearCallbackBeforeExpiry(){
    clearTimeout(_timeoutId)
  }
}

export default TokenService
