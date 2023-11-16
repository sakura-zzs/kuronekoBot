const fs = require('fs')

// 设备配置信息，需要通过配置校验才会通过
var fileName = `${__dirname}/response_group.json`;
var config = JSON.parse(fs.readFileSync(fileName));
var matchToReplyMap = new Map()
config.forEach(element => {
  var match = element.match
  var reply = element.reply
  if (matchToReplyMap.has(match)) {
    throw console.error('response_group 配置文件出现重复ID，请检查！' + uid);
  }
  matchToReplyMap.set(match, reply)
})

console.log("response_group 配置信息：")
console.log(matchToReplyMap)

function getReply(content) {
  var result = null
  if (content.indexOf('来自群管理员') > -1 || content.indexOf('Q群管家') > -1) {
    return result
  }
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
