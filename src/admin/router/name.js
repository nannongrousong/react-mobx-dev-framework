import { lazy } from 'react';

export default [{
    path: '/name/list',
    component: lazy(() => import(/* webpackChunkName: "name-list" */ 'ADMIN_PAGES/name/list'))
}, {
    path: '/name/import',
    component: lazy(() => import(/* webpackChunkName: "name-import" */ 'ADMIN_PAGES/name/import'))
}];