import React, { Component } from 'react';
import { Table } from 'antd';
import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS/table';
import PropTypes from 'prop-types';

class ResTable extends Component {
    componentDidUpdate() {
        console.log('ResTable.componentDidUpdate');
    }

    shouldComponentUpdate(prevProps) {
        const { tableInfo: oldTableInfo, pagination: oldPagination } = prevProps;
        const { tableInfo: newTableInfo, pagination: newPagination } = this.props;

        if (JSON.stringify(oldPagination) === JSON.stringify(newPagination)
            && JSON.stringify(oldTableInfo) === JSON.stringify(newTableInfo)) {
            return false;
        }

        return true;
    }

    render() {
        const columnsMap = [
            ['Name', '姓名'],
            ['Age', '年龄'],
            ['Sex', '性别']
        ];

        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='DataID'
                    scroll={{ x: width + 62, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        current,
                        pageSize,
                        total,
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        },
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        }
                    }}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        }
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

ResTable.propTypes = {
    tableInfo: PropTypes.object,
    pagination: PropTypes.object,
    setPagination: PropTypes.func.isRequired,
    setSelectRowKeys: PropTypes.func.isRequired
};

export default ResTable;