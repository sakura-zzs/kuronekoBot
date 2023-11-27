//从oicq迁移到icqq

const { createClient, segment } = require("icqq");
const client = require('./mqtt_client.js')
const { QQ_ID, QQ_PASSWORD } = require('./src/app/config')
const sign_api_addr = "http://127.0.0.1:801/sign?key=114514"
const bot = createClient({ platform: 1, sign_api_addr })
// const remindPrivate = require('./src/app/config/remind/remind_private.js')
const responseGroup = require('./src/app/config/response/response_group.js')
const responsePrivate = require('./src/app/config/response/response_private.js')
const { fetchSetu } = require('./src/app/config/setu')
// bot.on("system.login.captcha", () => {
//   process.stdin.once("data", input => {
//     bot.captchaLogin(input);
//   });
// });

// bot.on("system.login.slider", function (e) {
//   console.log("输入ticket：")
//   process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
// }).login(QQ_PASSWORD)
//之后还可能会输出设备锁url，需要去网页自行验证，也可监听 `system.login.device` 处理

bot.on('system.login.slider', (e) => {
  console.log('输入滑块地址获取的ticket后继续。\n滑块地址:    ' + e.url)
  process.stdin.once('data', (data) => {
    bot.submitSlider(data.toString().trim())
  })
})
bot.on('system.login.qrcode', (e) => {
  console.log('扫码完成后回车继续:    ')
  process.stdin.once('data', () => {
    bot.login()
  })
})
bot.on('system.login.device', (e) => {
  console.log('请选择验证方式:(1：短信验证   其他：扫码验证)')
  process.stdin.once('data', (data) => {
    if (data.toString().trim() === '1') {
      bot.sendSmsCode()
      console.log('请输入手机收到的短信验证码:')
      process.stdin.once('data', (res) => {
        bot.submitSmsCode(res.toString().trim())
      })
    } else {
      console.log('扫码完成后回车继续：' + e.url)
      process.stdin.once('data', () => {
        bot.login()
      })
    }
  })
})
bot.login(QQ_ID, QQ_PASSWORD)

bot.on("system.online", () => console.log("服务器：QQ上线"));
// system.offline.kickoff 被其他客户端踢下线， 默认不自动重登(见相关配置 kickoff)
bot.on("system.offline.kickoff", () => console.log("服务器踢下线"));
// system.offline.network 网络不通畅或服务器繁忙， 默认自动重登(见相关配置 reconn_interval)
bot.on("system.offline.network", () => console.log("网络错误导致下线"));

const hanlderGroupSetu = async (data) => {
  const groupName = data.group_name
  const user_id = data.sender.user_id
  const senderName = data.sender.nickname
  const message = data.raw_message
  console.log(`[${groupName}]${senderName}: ${message}`)

  var reply = responseGroup.getReply(message)
  if (message.includes("@setu")) {
    bot.sendGroupMsg(data.group_id, "setu搜寻中！");
    // reply = segment.image("./kuroneko.png")
    const { uid, title, author, imgUrl } = await fetchSetu(message)
    if (!imgUrl) {
      reply = "setu搜寻失败！,请更换关键词哦~"
    } else {
      console.log(imgUrl)
      const msg = [
        segment.at(user_id),
        ` 你要的setu已为你送达！\n`,
        `p站uid：${uid}\n`,
        `标题：${title}\n`,
        `作者：${author}\n`,
        segment.image(imgUrl)
      ]
      reply = msg
    }
  }
  if (reply) {
    bot.sendGroupMsg(data.group_id, reply);
  }
}

bot.on("message.group", async data => {
  console.log('服务器：收到一条群组消息')
  console.log(data)
  await hanlderGroupSetu(data)
});
let qq_sender_id = 2052400186
bot.on("message.private", data => {
  console.log('服务器：收到一条私聊消息')
  // console.log(data);
  qq_sender_id = data.from_id
  var senderName = data.sender.nickname
  var message = data.raw_message
  console.log(`[私聊]${senderName}: ${message}`)
  var reply = responsePrivate.getReply(message)
  if (message.trim()) {
    const qq_message = { qqMessage: message }
    client.publish('qq', JSON.stringify(qq_message))
  }
  if (reply) {
    bot.sendPrivateMsg(data.from_id, reply)
  }
});

bot.on("message.discuss", data => {
  console.log('服务器：收到一条讨论组消息')
  console.log(`[${data.group_name}]${data.sender.nickname}: ${data.raw_message}`)
});

// bot.on("message", data=>{
//   console.log(data);
// //   if (data.group_id > 0)
// //     bot.sendGroupMsg(data.group_id, "谁说只能回复hello");
// //   else
// //     bot.sendPrivateMsg(data.user_id, "hello");
// });

// const psd = "2001061316zzsqqq";  // 填上密码
// bot.login(psd);
// module.exports = bot
//处理服务器返回的信息
client.on("message", function (topic, message) {
  if (topic === "qq_send") {
    console.log("Received message:", message.toString());
    const msg = JSON.parse(message.toString())
    console.log(msg?.params?.params?.message_reply)
    bot.sendPrivateMsg(qq_sender_id, msg?.params?.params?.message_reply?.toString())
  }
});

