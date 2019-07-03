import { observable, action, configure } from 'mobx';
import { createViewModel } from 'mobx-utils';
configure({ enforceActions: 'observed' });

class View {
    @observable
    authInfo = {
        Mobile: '',
        UserName: ''
    }
}

export default class Store {
    viewModel = createViewModel(new View());

    @action
    setAuthInfo = (authInfo: any) => {
        this.viewModel.authInfo = authInfo;
    }
}