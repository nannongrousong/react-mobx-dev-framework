import React from 'react';
import { Spin } from 'antd';

export default () => (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <Spin size='large' tip='页面正在加载中，请稍后。'></Spin>
    </div>
);