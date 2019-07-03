import authStore from './auth';
import homeStore from './home';
//  全局store
export default {
    authStore: new authStore(),
    homeStore: new homeStore()
};