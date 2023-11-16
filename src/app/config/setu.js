const kuronekoBotSetuRequest = require('../../service')


async function fetchSetu(tag) {
  tag = tag.replace("@setu", "").trim().split(" ")
  // console.log(tag)
  let res = await kuronekoBotSetuRequest.post({ data: { tag }, })
  res = res.data?.data[0]
  const imgUrl = res?.urls?.original
  const uid = res?.uid
  const title = res?.title
  const author = res?.author
  return res ? { uid, title, author, imgUrl } : false
}



module.exports = { fetchSetu } 