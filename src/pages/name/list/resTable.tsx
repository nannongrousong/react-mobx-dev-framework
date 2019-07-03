import React, { Component } from 'react';
import { Table } from 'antd';
import { generateColInfo, tablePageDefaultOpt } from '@/utils/table';

interface TableInfo {
    dataList: any[];
    total: number;
    loading: boolean;
    selectedRowKeys: any[];
}

interface Pagination {
    current: number;
    pageSize: number;
}

interface TableProp {
    tableInfo: TableInfo;
    pagination: Pagination;
    setPagination: (a: number, b: number) => void;
    setSelectRowKeys: (a: any[], b: any[]) => void;
}

class ResTable extends Component<TableProp> {
    shouldComponentUpdate(prevProps: TableProp) {
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
                        onShowSizeChange: (current: number, size: number) => {
                            setPagination(current, size);
                        },
                        onChange: (page: number, pageSize: number) => {
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

export default ResTable;