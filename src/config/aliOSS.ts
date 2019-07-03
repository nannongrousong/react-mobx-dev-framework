const OSS_CONFIG = {
    development: {
        region: 'oss-cn-shanghai',
        privateBucket: 'privateBucket',
        publicBucket: 'publicBucket'
    },
    alpha: {
        region: 'oss-cn-shanghai',
        privateBucket: 'privateBucket',
        publicBucket: 'publicBucket'
    },
    sit: {
        region: 'oss-cn-shanghai',
        privateBucket: 'privateBucket',
        publicBucket: 'publicBucket'
    },
    production: {
        region: 'oss-cn-shanghai',
        privateBucket: 'privateBucket',
        publicBucket: 'publicBucket'
    }
};
let oss = OSS_CONFIG[NODE_ENV] || OSS_CONFIG.alpha;

//  private时必须调用client.signatureUrl获取url
oss.getPublicPrefixPath = () => {
    if (NODE_ENV === 'production') {
        return 'http://cdn.a.b/';
    }
    return `http://${this.publicBucket}.oss-cn-shanghai.aliyuncs.com/`;
};
export default oss;