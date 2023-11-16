const mqtt = require('mqtt')
const { MQTT_HOST, MQTT_PORT, MQTT_USER, MQTT_PASSWORD } = require('./src/app/config')
//连接到 MQTT 服务器
const client = mqtt.connect(`${MQTT_HOST}:${MQTT_PORT}`, {
  username: MQTT_USER,   //用户名
  password: MQTT_PASSWORD,  //密码
  clientId: '1',      //客户端id
});

//订阅主题
client.on("connect", function () {
  //订阅服务器主题，以获取服务器该主题携带的数据
  client.subscribe("qq_reply", function (err) {
    if (!err) {
      console.log("Subscribed to get_reply");
    }
  });
});

//处理服务器返回的信息
client.on("message", function (topic, message) {
  if (topic === "qq_reply") {
    console.log("Received message:", message.toString());
  }
});
// client.publish("qq", "111")
module.exports = client
