let authoritySet = new Set();

export function setAuthorityList(set) {
    authoritySet = set;
}

export default function authority(auth) {
    let resid;
    let tAuth = typeof auth;
    if (tAuth === 'object') {
        resid = auth.resid;
    } else if (tAuth === 'string') {
        resid = auth;
    }
    return component => authoritySet.has(resid) ? component : null;
}