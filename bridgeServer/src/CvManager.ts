import path from 'path'
import { spawn } from 'child_process'
import net from 'net'

const host = '127.0.0.1'

const cvCorePath = path.join(__dirname, './../../processor/out/artifacts/processor_jar/processor.jar')

export class CvManager{
  private readonly cvCore = ""

  constructor(){
    const port = 9503
    //this.cvCore = spawn('java', ['-jar', cvCorePath, port.toString()])
    //this.cvCore.stdout.pipe(process.stdout)
  }

  async process(imageBase64: string){
    return new Promise<string>((resolve, reject) => {
      try{
        const connector = net.connect({
          host:host, port:9503
        })
        connector.setEncoding('utf8')
        connector.write(imageBase64)
        connector.end()
        connector.on('data', (data) => {
          resolve(data.toString('utf-8'))
        })
      }catch(ex){}
    })
  }

  close(){
    /*this.connector.destroy()
    this.cvCore.kill(0)*/
  }

}