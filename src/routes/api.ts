import { storePhoneID } from './store.ts'
import { defaultPhoneID, apiUrl } from './config'

import MD5 from "crypto-js/md5";

var phoneID:string;
storePhoneID.subscribe((v:string) => phoneID)

export const fetchApi = (sensors: string[]) => {

  const headers:any = {
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    // 'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86 Build/MASTER)',
    // 'Host': 'www.data199.com',
    // 'Connection': 'Keep-Alive',
    // 'Accept-Encoding': 'gzip',
    // 'Content-Length': '555',
    // 'Access-Control-Allow-Origin': '*'
  }

const payload_token:any = {
    'devicetoken':      'empty',
    'vendorid':         'BE60BB85-EAC9-4C5B-8885-1A54A9D51E2',
    'phoneid':          phoneID ? phoneID : defaultPhoneID,
    'version':          '1.54',
    'build':            '201',
    'executable':       'eu.mobile_alerts.weatherhub',
    'bundle':           'eu.mobile_alerts.weatherhub',
    'lang':             'en',
    'timezoneoffset':   '0',
    'timeampm':         'true',
    'usecelsius':       'true',
    'usemm':            'true',
    'speedunit':        '0',
    'ccon':             'false',
    'timestamp':        Math.floor(Date.now() / 1000),
  }

  // Calculate AccessToken
  var tokenArray:string[] = []
  for (var key in payload_token) {
    if (payload_token.hasOwnProperty(key)) {
      tokenArray.push(`${key}=${payload_token[key]}`)
    }
  }

  var token = tokenArray.join('&')
  token = token.replaceAll('-', '')
  token = token.replaceAll(',', '')
  token = token.replaceAll('.', '')
  token = token + 'uvh2r1qmbqk8dcgv0hc31a6l8s5cnb0ii7oglpfj'
  token = token.toLowerCase()


  const payload_untoken:any = {
    'requesttoken':      MD5(token).toString(),
    'deviceids':         sensors.join(',') + ',',
    'measurementfrom':  '0',
    'measurementcount': '50'
  }

  const payload = {...payload_token, ...payload_untoken}

  return fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  })
 


}