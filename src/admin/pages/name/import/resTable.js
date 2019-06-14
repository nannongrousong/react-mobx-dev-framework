import React, { Component } from 'react';
import { Table } from 'antd';
import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS/table';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['UserName', '姓名'],
            ['IDCardNum', '身份证号码', undefined, 180]
        ];

        const {
            tableInfo: {
                dataList, loading
            }
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='Number'
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

ResTable.propTypes = {
    tableInfo: PropTypes.object
};

export default ResTable;