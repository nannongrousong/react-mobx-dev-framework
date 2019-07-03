import React, { Component, Suspense } from 'react';
import { Layout, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import cryptoJS, { AES } from 'crypto-js';
import { appSecret } from '@/config/index';
import NavHeader from '@/component/NavHeader';
import NavSlider from '@/component/NavSlider';
import NavTab from '@/component/NavTab';
import Exception from '@/component/Exception';
import allRouters from '@/router';
import { basename } from '@/config/index';
import Loading from '@/component/loading';
import { setAuthInfo as setReqAuthInfo } from '@/utils/request';
import navMenu from '@/config/navMenu';
import styles from '@/styles/page/home.less';

const { Content } = Layout;

const createRouteInfo = (allRouters: any[], navMenu: any[]) => {
    const authPaths = navMenu.map((item: any): any => (item.Path));
    const authRouters: any[] = [];
    allRouters.forEach((routerItem, index) => {
        const { path, component, exact = true } = routerItem;
        if (authPaths.includes(path)) {
            authRouters.push(<Route
                key={index}
                path={path}
                component={component}
                exact={exact} />);
        }
    });

    return (
        <Suspense fallback={<Loading />}>
            <Switch>
                {authRouters}
                <Route path='/500' component={() => <Exception type={500} homePath={`${basename}/index`} />} />
                <Route path='/403' component={() => <Exception type={403} homePath={`${basename}/index`} />} />
                <Route path='*' component={() => <Exception type={404} homePath={`${basename}/index`} />} />
            </Switch>
        </Suspense>
    );
};

@inject('authStore', 'homeStore')
@observer
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            isLogin: !!sessionStorage.getItem('UAI')
        };

        //  非当前激活的tab页右击操作会再出发tabChange事件，但实际上并不需要
        this.DO_NOT_HANDLE_TAB_CHANGE = false;
    }

    componentDidMount() {
        //  用户主动刷新了页面
        if (this.state.isLogin) {
            const userInfoStr = AES.decrypt(sessionStorage.getItem('UAI'), appSecret);
            const userInfo = JSON.parse(userInfoStr.toString(cryptoJS.enc.Utf8));
            const { history } = this.props;
            const { setAuthInfo } = this.props.authStore;
            const { initNavMenu, setNavMenu } = this.props.homeStore;
            const { location: { pathname } } = history;
            //  设置当前系统菜单列表，暂时写死，以后可能会从接口中获取
            setNavMenu(navMenu);
            //  初始化菜单
            const newPath = initNavMenu(pathname);
            newPath != pathname && history.push(newPath);
            //  设置用户信息
            setAuthInfo(userInfo);
            //  请求中携带用户信息
            setReqAuthInfo(userInfo.Token, userInfo.UID);
        }
    }

    componentDidCatch(err, info) {
        console.error('componentDidCatch.error', err);
        console.error('componentDidCatch.info', info);
        const { history } = this.props;
        history.push('/500');
    }

    handleCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    handleTabsEdit = (targetPath, action) => {
        if (!targetPath) {
            return;
        }

        const { homeStore: { closeNavTab, closeOtherNavTab, closeAllNavTab }, history } = this.props;

        if (action == 'remove') {
            const newPath = closeNavTab(targetPath);

            if (newPath) {
                history.push(newPath);
            } else {
                this.handleNoTab();
            }
            this.DO_NOT_HANDLE_TAB_CHANGE = true;
            setTimeout(() => {
                this.DO_NOT_HANDLE_TAB_CHANGE = false;
            }, 1000);
        }

        if (action == 'removeOther') {
            closeOtherNavTab(targetPath);
        }

        if (action == 'removeAll') {
            closeAllNavTab();
            this.handleNoTab();
        }
    }

    handleTabsChange = (path) => {
        if (!this.DO_NOT_HANDLE_TAB_CHANGE) {
            const { homeStore: { setActiveTab }, history } = this.props;
            const newPath = setActiveTab(path);
            history.push(newPath);
        }
    }

    handleMenuClick = ({ key: path }) => {
        const { homeStore: { setActiveTab }, history } = this.props;
        const newPath = setActiveTab(path);
        history.push(newPath);
    }

    //  处理tab页关闭到零的情况
    handleNoTab = () => {
        this.handleMenuClick({ key: '/index' });
    }

    handleLogout = () => {
        Modal.confirm({
            title: '',
            content: '请确认退出登录？',
            onOk: () => {
                const { history } = this.props;
                sessionStorage.removeItem('UAI');
                setReqAuthInfo('', '');
                history.push('/login');
            }
        });
    }

    render() {
        const { viewModel: { navMenu, navTab, activeRoute } } = this.props.homeStore;
        const { viewModel: { authInfo } } = this.props.authStore;
        const { collapsed, isLogin } = this.state;

        return (
            isLogin ?
                <Layout className='h-100'>
                    <NavHeader
                        {...authInfo}
                        collapsed={collapsed}
                        handleCollapse={this.handleCollapse}
                        handleLogout={this.handleLogout} />

                    <Layout>
                        <NavSlider
                            collapsed={collapsed}
                            navMenu={navMenu}
                            handleCollapse={this.handleCollapse}
                            handleMenuClick={this.handleMenuClick}
                            activeRoute={activeRoute} />

                        <Content className={styles['layout-content']}>
                            {
                                activeRoute &&
                                <NavTab
                                    handleTabsEdit={this.handleTabsEdit}
                                    handleTabsChange={this.handleTabsChange}
                                    navTab={navTab}
                                    activeRoute={activeRoute} >
                                </NavTab>
                            }

                            {
                                navMenu.length &&
                                <div className={styles.content} style={{ top: activeRoute ? '40px' : 0 }}>
                                    {
                                        createRouteInfo(allRouters, navMenu)
                                    }
                                </div>
                            }
                        </Content>
                    </Layout>
                </Layout>
                : <Redirect to={{ pathname: '/login', state: { from: this.props.history.location.pathname } }}></Redirect>
        );
    }
}

Index.propTypes = {
    history: PropTypes.object,
    initNavMenu: PropTypes.func,
    setActiveTab: PropTypes.func,
    navMenu: PropTypes.array,
    navTab: PropTypes.array,
    activeRoute: PropTypes.string,
    closeNavTab: PropTypes.func,
    closeOtherNavTab: PropTypes.func,
    closeAllNavTab: PropTypes.func,
    setAuthInfo: PropTypes.func,
    homeStore: PropTypes.object,
    authStore: PropTypes.object
};
export default Index;


export const TabWrapper = (storeName, storeObj) => {
    return (WrappedComp) => {
        @inject('homeStore')
        @observer
        class HOC extends Component {
            componentDidMount() {
                const { editTabStore } = this.props.homeStore;
                const { pathname } = this.props.history.location;
                editTabStore(pathname, storeName);
            }

            componentWillUnmount() {
                //  最新的结果集
                const { storeMap } = this.props.homeStore.viewModel;
                const existStoreList = Object.values(storeMap);
                //  当前要卸载的storeName storeList缓存中没有该storeName则清除view
                if (!existStoreList.includes(storeName)) {
                    try {
                        storeObj.viewModel.reset();
                    } catch (err) {
                        //  可能是没有store、或者有store没view，不处理
                    }
                }
            }

            render() {
                return <WrappedComp {...{ [storeName]: storeObj }} {...this.props} />;
            }
        }

        HOC.propTypes = {
            homeStore: PropTypes.object,
            history: PropTypes.object
        };

        return HOC;
    };
};
