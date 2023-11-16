const fs = require('fs')

// 设备配置信息，需要通过配置校验才会通过
var fileName = `${__dirname}/response_private.json`;
var config = JSON.parse(fs.readFileSync(fileName));
var matchToReplyMap = new Map()
config.forEach(element => {
  var match = element.match
  var reply = element.reply
  if (matchToReplyMap.has(match)) {
    throw console.error('response_private 配置文件出现重复ID，请检查！' + uid);
  }
  matchToReplyMap.set(match, reply)
})

console.log("response_private 配置信息：")
console.log(matchToReplyMap)

function getReply(content) {
  var result = null
  matchToReplyMap.forEach((reply, match) => {
    if (content.indexOf(match) > -1) {
      result = reply
    }
  })

  return result
}

module.exports = {
  getReply
}
