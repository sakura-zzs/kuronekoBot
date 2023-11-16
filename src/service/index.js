const { SETU_BASE_URL, TIME_OUT } = require('./request/config')

const KuronekoRequest = require('./request')

const kuronekoBotSetuRequest = new KuronekoRequest({
  baseURL: SETU_BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      config.headers["Content-Type"] = "application/json"
      return config
    }
  }
})

module.exports = kuronekoBotSetuRequest
