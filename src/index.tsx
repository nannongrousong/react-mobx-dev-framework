import 'core-js/features/promise';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Router } from 'react-router-dom';
import { LocaleProvider, message } from 'antd';
import { Provider } from 'mobx-react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { createBrowserHistory } from 'history';
import '@/styles/utilities/main.less';
import store from '@/store';
import { basename } from '@/config/index';
import adminComp from '@/pages/home';
import loginComp from '@/pages/login';

//  全局消息只弹出一个
message.config({
    maxCount: 1
});

class App extends Component {
    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <Provider {...store}>
                    <Router history={createBrowserHistory({ basename })}>
                        <Switch>
                            <Route path='/login' component={loginComp} />
                            <Route path='/' component={adminComp} />
                        </Switch>
                    </Router>
                </Provider>
            </LocaleProvider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

module.hot && module.hot.accept();