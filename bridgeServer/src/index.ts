import Express from 'express'
import path from 'path'
import { CvManager } from "./CvManager"
import base64url from 'base64url'

const manager = new CvManager()

const isJson = (txt: string) => {
  try{
    JSON.parse(txt)
    return true
  }catch(ex){return false}
}

const app = Express()
app.use(Express.text({limit:'60mb'}))
app.post('/video', async (req, res) => {
  const base64 = base64url.toBase64(req.body.replace(/^data:image\/(png|jpg);base64,/, ""))
  const result = await manager.process(base64)
  
  res.send(isJson(result) ? JSON.parse(result) : result)
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, './../assets/index.html'))
})

app.listen(80, () => {
  console.log('Server is started.')
})