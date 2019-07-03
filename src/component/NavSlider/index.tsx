
import React from 'react';
import { Layout } from 'antd';
import NavMenu from '@/component/NavMenu';

const { Sider } = Layout;

interface NavSliderProp {
    collapsed: boolean;
    navMenu: any[];
    handleMenuClick: () => void;
    handleCollapse: () => void;
    activeRoute: string;
}

const NavSlider = ({ collapsed, navMenu, handleMenuClick, handleCollapse, activeRoute }: NavSliderProp) => (
    <Sider
        collapsed={collapsed}
        onCollapse={handleCollapse}
        collapsible>
        <NavMenu
            menus={navMenu}
            handleMenuClick={handleMenuClick}
            activeRoute={activeRoute} />
    </Sider>
);

export default NavSlider;