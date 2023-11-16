const dotenv = require("dotenv")
dotenv.config()

module.exports = {
  MQTT_PORT,
  MQTT_HOST,
  MQTT_USER,
  MQTT_PASSWORD,
  QQ_ID,
  QQ_PASSWORD
} = process.env

