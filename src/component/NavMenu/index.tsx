
import React from 'react';
import { Menu, Icon } from 'antd';
import { createTreeNode } from '@/utils/index';

const { Item: MenuItem, SubMenu } = Menu;

const renderIcon = (icon: string) => {
    if (/\.(png|jpe?g|gif|svg)$/.test(icon)) {
        //  图片
        return <img style={{ display: 'inline-block', height: '16px', width: '16px', marginRight: '10px' }} src={icon} />;
    } else {
        //  图标
        return <Icon type={icon} />;
    }
};

interface MenuProp {
    MenuID: number;
    ParentID: number;
    Title: number;
    Icon: string;
    Children: any[];
    Path: string;
    Type: string;
}

const createMenus = (menus: MenuProp[]) => {
    //  有children忽略path参数
    return menus.map((item: MenuProp) => {
        const { MenuID, Title, Icon: IconV, Children, Path, Type } = item;

        if (Children) {
            //  SubMenu无path， key使用item.key
            return (
                <SubMenu
                    key={MenuID}
                    title={<span>{renderIcon(IconV)}<span>{Title}</span></span>}>
                    {createMenus(Children)}
                </SubMenu>
            );
        } else if (Type == 'node') {
            //  MenuItem一定有path且唯一，key使用item.path，避免查找工作
            return (
                <MenuItem key={Path} >
                    {renderIcon(IconV)}
                    <span className='nav-text'>{Title}</span>
                </MenuItem>
            );
        } else {
            return null;
        }
    });
};

interface NavMenuProp {
    menus: MenuProp[];
    handleMenuClick: () => void;
    activeRoute: string;
}

const NavMenu = ({ menus, handleMenuClick, activeRoute }: NavMenuProp) => {
    //  首次拒绝渲染
    if (activeRoute === '') {
        return null;
    }

    const resMenu = menus.find(({ Path }) => (Path === activeRoute));
    const defaultOpenKeys = resMenu ? [resMenu.ParentID + ''] : undefined;

    return (
        <Menu
            theme='dark'
            mode='inline'
            defaultOpenKeys={defaultOpenKeys}
            selectedKeys={[activeRoute]}
            onClick={handleMenuClick}>
            {
                createMenus(createTreeNode(menus))
            }
        </Menu>
    );
};

export default NavMenu;