import { observable, action, configure } from 'mobx';
import { createViewModel } from 'mobx-utils';

configure({ enforceActions: 'observed' });

/**
 * 根据路由path获取导航路由详情
 * @param {String} path 路由
 * @param {Array} routers  已有路由集合
 */
const getRouteInfo = (path: string, routers: object[]): any => {
    for (let router of routers) {
        //  index首页会匹配第一个有效路由页
        if ((path === '/index' || path === '/') && router.Path) {
            return router;
        } else {
            if (router.Path == path) {
                return router;
            }
        }
    }
};

class View {
    //  所有的导航路由信息。一位数组，没有嵌套children
    @observable
    navMenu: object[] = [];
    //  当前tab中显示的路由集合
    @observable
    navTab: object[] = [];
    //  当前页面所在的路由
    @observable
    activeRoute: string = '';
    //  存储当前路由与storeName的关系集合
    @observable
    storeMap: object = {};
}

export default class Store {
    viewModel = createViewModel(new View());

    /**
     * 设置菜单列表
     * @param {Array} menus 菜单列表
     */
    @action
    setNavMenu = (menus: object[]) => {
        const viewModel = this.viewModel;
        viewModel.navMenu = menus;
    }

    /**
     * 页面首次进入初始化
     * @param {String} initPath 页面初始化path
     */
    @action
    initNavMenu = (initPath: string): string => {
        const viewModel = this.viewModel;
        const { navMenu } = viewModel as any;

        let routeInfo = getRouteInfo(initPath, navMenu);

        if (!routeInfo) {
            return '';
        }

        const { Path, Title } = routeInfo;
        document.title = Title;

        viewModel.activeRoute = Path;
        viewModel.navTab = [routeInfo];

        //  返回新的可用路径
        return Path;
    }

    /**
     * 设置当前激活tab页
     * @param {String} tabPath 当前激活的tab页path
     */
    @action
    setActiveTab = (tabPath: string): string => {
        const viewModel = this.viewModel;
        let { navTab, navMenu, activeRoute } = viewModel as any;
        let routeInfo = getRouteInfo(tabPath, navMenu);

        if (!routeInfo || activeRoute == tabPath) {
            return '';
        }

        let { Path, Title } = routeInfo as any;
        document.title = Title;

        let resTab = navTab.find((tab: any): boolean => tab.Path == Path);

        viewModel.activeRoute = Path;
        //  没有，新加；有，集合保持不变
        viewModel.navTab = !resTab ? [...navTab, routeInfo] : navTab;

        return Path;
    }

    /**
     * 关闭当前激活tab
     * @param {String} tabPath 当前激活的tab页path
     */
    @action
    closeNavTab = (tabPath: string): string => {
        const viewModel = this.viewModel;
        const { navTab, activeRoute } = viewModel as any;
        let newPath = '';
        let tabIndex = navTab.findIndex((route: any): boolean => route.Path == tabPath);

        //  关闭的是当前激活的
        if (tabPath == activeRoute) {
            if (tabIndex == navTab.length - 1) {
                //  当前激活的是最后一个tab页，取相邻左边一个
                //  考虑仅剩下一个情况
                newPath = (navTab.length == 1) ? '' : navTab[tabIndex - 1].Path;
            } else {
                //  当前激活的非最后一个tab页，取相邻右边一个
                newPath = navTab[tabIndex + 1].Path;
            }
        } else {
            newPath = activeRoute;
        }

        viewModel.activeRoute = newPath;
        //  从tab页集合中删除
        viewModel.navTab = [...navTab.slice(0, tabIndex), ...navTab.slice(tabIndex + 1, navTab.length)];
        //  删除与store的对应关系
        this.resetTabStore([tabPath]);

        return newPath;
    }

    /**
     * 关闭非当前激活tab
     * @param {String} tabPath 当前激活的tab页path
     */
    @action
    closeOtherNavTab = (tabPath: string) => {
        const viewModel = this.viewModel;
        let { navMenu, navTab } = viewModel as any;
        let routeInfo = getRouteInfo(tabPath, navMenu);

        //  关闭其他 那就只保留当前一个
        viewModel.activeRoute = tabPath;
        viewModel.navTab = [routeInfo];

        let storePaths: string[] = [];
        navTab.forEach((tab: any) => {
            if (tab.Path != tabPath) {
                storePaths.push(tab.Path);
            }
        });

        this.resetTabStore(storePaths);
    }

    /**
     * 关闭所有标签页
     */
    @action
    closeAllNavTab = () => {
        const viewModel = this.viewModel;
        let { navTab } = viewModel as any;
        let storePaths = navTab.map((tab: any): string => (tab.Path));

        viewModel.activeRoute = '';
        viewModel.navTab = [];

        this.resetTabStore(storePaths);
    }

    /**
     * 每次tab页被激活触发
     * @param {String} path 被激活的tab页path
     * @param {String} storeName 被激活的tab页storeName
     */
    @action
    editTabStore = (path: string, storeName: string) => {
        const viewModel = this.viewModel;
        const { storeMap } = viewModel as any;
        //  添加与store的对应关系
        storeMap[path] = storeName;
    }

    /**
     * 删除与store的对应关系
     * @param {Array} storePaths 需删除的路由path列表
     */
    @action
    resetTabStore = (storePaths: string[]) => {
        const viewModel = this.viewModel;
        const { storeMap } = viewModel as any;
        storePaths.forEach((path) => {
            delete storeMap[path];
        });
    }
}