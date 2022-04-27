import { exec, spawn } from "child_process"
import ipRegex from 'ip-regex'
import sleep from 'p-sleep'
import inquirer from 'inquirer'

let suffix = ''

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false)
    resolve()
  }))
}

function pexec(command) {
  return new Promise(function(resolve, reject) {
      exec(command, (error, stdout, stderr) => {
          if (error) {
              reject(error);
              return;
          }

          resolve(stdout.trim());
      });
  });
}

const getADBDevices = async () => {
  let devices = [];

  (await pexec("adb"+suffix+" devices")).split('\n').map(device => {
    device = device.split('\t')
    if(!device[0].includes('List of devices attached')) {
      devices.push({
        id: device[0],
        status: device[1]
      })
    }
  })

  return devices
}

const getIPConnected = devices => {
  for(let device of devices) {
    if(ipRegex().test(device.id) && device.status == 'device')
      return device
  }
}

const logDevices = devices => {
  if(devices) {
    devices.map(dev => {
      console.log(`ID: ${dev.id} | status: ${dev.status == 'device' ? 'connected' : dev.status}`)
    })
  }
}

const dotsleep = async (sleepms, dots) => {
  for(let i=1;i<=dots;i++) {
    process.stdout.write('.')
    await sleep(sleepms/dots)
  }
  process.stdout.write('\n')
}

;(async () => {
  const adbpath = (await inquirer.prompt({
    type: "list", name: "path", message: "Choose your ADB path:",
    choices: [ { name: "Unity", value: "unity" }, { name: "Default PATH", value: "default" } ]})).path

  // await keypress()
  try {
    if(adbpath == 'unity') {
      console.log(await pexec("cd  \"C:\\Program Files\\Unity\\Hub\\Editor\\2021.3.1f1\\Editor\\Data\\PlaybackEngines\\AndroidPlayer\\SDK\\platform-tools\""))
      suffix = '.exe'
    }
  
    const ipconnecteddevice = getIPConnected(await getADBDevices())
    if(ipconnecteddevice) { console.log(`Already connected: ${ipconnecteddevice.id}. Have fun!`); process.exit(0) }

    console.log('Connect Quest2 via USB and press any key to continue.')

    const devices = await getADBDevices()
    console.log('Devices:'); logDevices(devices); console.log('')

    if(devices.length == 0) { console.log('No devices found. Please connect your Quest via USB to enable WiFi access and restart this script.'); process.exit(1) }

    process.stdout.write(await pexec("adb"+suffix+" tcpip 5555"))
    await dotsleep(3000, 3)

    const ip = (await pexec("adb"+suffix+" shell ip route")).match(/(?<=src ).*$/g)[0]
    console.log(`IP: ${ip}`)

    await sleep(1000)

    console.log("\n" + await pexec(`adb${suffix} connect ${ip}`))
    console.log("Have fun!")
  } catch(err) {
    console.log("Error:")
    console.log(err)
  }
})().then(process.exit)