import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import NavMenu from 'ADMIN_COMPONENT/NavMenu';

const { Sider } = Layout;

const NavSlider = ({ collapsed, navMenu, handleMenuClick, handleCollapse, activeRoute }) => (
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

NavSlider.propTypes = {
    collapsed: PropTypes.bool,
    navMenu: PropTypes.array,
    handleCollapse: PropTypes.func,
    handleMenuClick: PropTypes.func,
    activeRoute: PropTypes.string
};

export default NavSlider;