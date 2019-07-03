import React from 'react';
import impTemp from '@/assets/template/name_import.xlsx';

export default function () {
    return (
        <div className='mb-16'>
            <span className='color-danger'>表格中必须包含：姓名，身份证号码。</span>
            <a download='平台用户导入模板.xlsx' href={impTemp} className='ml-32'>模板下载</a>
        </div>
    );
}