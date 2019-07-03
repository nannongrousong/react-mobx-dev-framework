import { lazy } from 'react';

export default [{
    path: '/name/list',
    component: lazy(() => import(/* webpackChunkName: "name-list" */ '@/pages/name/list'))
}, {
    path: '/name/import',
    component: lazy(() => import(/* webpackChunkName: "name-import" */ '@/pages/name/import'))
}];