import React from 'react';
import { Dropdown, Menu, Layout, Icon } from 'antd';
import styles from 'ADMIN_STYLES/page/home.less';
import logoImg from 'ADMIN_IMAGES/logo.jpg';
import PropTypes from 'prop-types';

const { Header } = Layout;
const { Item: MenuItem } = Menu;

const NavHeader = ({ collapsed, handleCollapse, handleLogout, UserName }) => (
    <Header className={styles.header}>
        <div className='left'>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} className={styles['switch-icon']} onClick={handleCollapse} />
            <span>开放平台</span>
        </div>

        <div className='center'>

        </div>

        <div className='right'>
            <Dropdown
                className={styles.userinfo}
                overlay={
                    <Menu>
                        <MenuItem key="3" onClick={handleLogout}><Icon type='logout' /> 退出登录</MenuItem>
                    </Menu>
                }>
                <div>
                    <img src={logoImg} />
                    <a href="#">{UserName}</a>
                </div>
            </Dropdown>
        </div>
    </Header>
);

NavHeader.propTypes = {
    collapsed: PropTypes.bool,
    handleCollapse: PropTypes.func,
    handleLogout: PropTypes.func,
    UserName: PropTypes.string
};

export default NavHeader;
