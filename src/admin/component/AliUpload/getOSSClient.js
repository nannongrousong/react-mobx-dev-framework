import { getSercetKey } from 'ADMIN_SERVICE/AliyunService';
import ossConfig from 'ADMIN_CONFIG/aliOSS';

// 调整阿里云权限获取逻辑
// 1.判断存在未过期的key时，不在请求key直接使用
let ossKeyInfo;
let ossClinet;

export default async (oss) => {
    try {
        const aliOSS = await import('ali-oss');
        if (!ossKeyInfo || +new Date() > new Date(ossKeyInfo.Expiration).getTime()) {
            const { Data } = await getSercetKey();
            const { AccessKeyId, AccessKeySecret, SecurityToken } = Data;
            if (!AccessKeyId || !AccessKeySecret || !SecurityToken) {
                throw new Error('获取ali token失败，请稍后再试！');
            }
            ossKeyInfo = Data || {};
        }

        ossClinet = new aliOSS.default({
            accessKeyId: ossKeyInfo.AccessKeyId,
            accessKeySecret: ossKeyInfo.AccessKeySecret,
            bucket: oss.bucket || ossConfig.publicBucket,
            region: oss.region || ossConfig.region,
            stsToken: ossKeyInfo.SecurityToken
        });

        return ossClinet;
    } catch (err) {
        throw err;
    }
};