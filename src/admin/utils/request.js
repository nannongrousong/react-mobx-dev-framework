//  core-js中不包括fetch https://github.com/zloirock/core-js#readme
import 'whatwg-fetch';
import { MD5 } from 'crypto-js';
import { appKey as AppKey, appSecret as AppSecret } from 'ADMIN_CONFIG';

let Token = '';
let Uid = '';

const request = (url, param) => {
	console.log('%c请求地址：', 'color:red;', url);
	console.log('%c请求参数：', 'color:red;', param);

	const Data = JSON.stringify(param || {});
	const TimeStamp = Math.round((new Date()).getTime() / 1000);

	let errMsg = '';

	return new Promise((resolve, reject) => {
		fetch('/api' + url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
			body: JSON.stringify({
				AppKey,
				AppVer: '1.0.0',
				Data,
				DeviceName: 'DeviceName',
				DeviceType: 'DeviceType',
				Lang: 'CN',
				Sign: getSign(Data, TimeStamp),
				TimeStamp,
				Token,
				Uid
			})
		}).then(async (res) => {
			if (res.ok && res.status === 200) {
				const resData = await res.json();
				const { Code, Desc, Data } = resData;
				if (Code === 0) {
					resolve(resData);
					console.log('%c返回数据：', 'color:red;', Data);
				} else {
					reject(Desc);
				}
			} else {
				errMsg = res.statusText;
				console.error(errMsg);
				reject(errMsg);
			}
		}).catch((err) => {
			errMsg = '网络错误，请检查当前网络是否可用。';
			console.error(err);
			reject(errMsg);
		});
	});
};

const getSign = (dataStr, timestamp) => (MD5(AppKey + timestamp + dataStr + AppSecret, 32).toString());

/**
 *
 * @param {String} token
 * @param {String} uid
 */
const setAuthInfo = (token, uid) => {
	Token = token;
	Uid = uid;
};

/**
 * 从阿里云获取文件信息
 * @param {*} url 
 */
const requestComJson = (url) => {
	console.log('%c请求地址：', 'color:red;', url);

	let errMsg = '';

	return new Promise((resolve, reject) => {
		fetch(url).then((res) => {
			if (res.ok && res.status === 200) {
				resolve(res.json());
			} else {
				errMsg = res.statusText;
				console.error(errMsg);
				reject(errMsg);
			}
		}).catch((err) => {
			errMsg = '网络错误，请检查当前网络是否可用。';
			console.error(err);
			reject(errMsg);
		});
	});
};

export default request;
export {
	setAuthInfo,
	requestComJson
};