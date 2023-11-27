const mqtt = require('mqtt')
const { MQTT_HOST, MQTT_PORT, MQTT_USER, MQTT_PASSWORD } = require('./src/app/config')
// const bot = require('./qq_client')
//连接到 MQTT 服务器
const client = mqtt.connect(`${MQTT_HOST}:${MQTT_PORT}`, {
  username: MQTT_USER,   //用户名
  password: MQTT_PASSWORD,  //密码
  clientId: '2',      //客户端id
});

//订阅主题
client.on("connect", function () {
  //订阅服务器主题，以获取服务器该主题携带的数据
  client.subscribe("qq_send", function (err) {
    if (!err) {
      console.log("Subscribed to qq_send");
    }
  });
});


// client.publish("qq", "111")
module.exports = client
