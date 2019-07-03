import React from 'react';
import { Dropdown, Menu, Layout, Icon } from 'antd';
import styles from '@/styles/page/home.less';
import logoImg from '@/images/logo.jpg';

const { Header } = Layout;
const { Item: MenuItem } = Menu;

interface NavHeaderProps {
    collapsed: boolean;
    handleCollapse: () => void;
    handleLogout: () => void;
    UserName: string;
}

const NavHeader = ({ collapsed, handleCollapse, handleLogout, UserName }: NavHeaderProps) => (
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

export default NavHeader;
