import { observable, action, configure, transaction } from 'mobx';
import { message } from 'antd';
import { createViewModel } from 'mobx-utils';
import { safeEditViewModel } from '../utils';
import { listName, getResByBizID, destoryName } from '@/service/Name';
import { errorHandle, getResAsync } from '@/utils/index';

configure({ enforceActions: 'observed' });

class View {
    @observable
    searchValue = {
        IntvDate: [undefined, undefined],
        IDCardNum: '',
        UserName: '',
        IsValid: -9999
    }

    @observable
    pagination = {
        current: 1,
        pageSize: 10
    }

    @observable
    tableInfo = {
        dataList: [],
        total: 0,
        loading: false,
        selectedRowKeys: []
    }
}

export default class Store {
    viewModel = createViewModel(new View());

    @action
    resetForm = () => {
        const viewModel = this.viewModel;
        viewModel.resetProperty('searchValue');
    }

    @action
    handleFormChange = (changedValues: any) => {
        const viewModel = this.viewModel;

        viewModel.searchValue = {
            ...viewModel.searchValue,
            ...changedValues
        };
    }

    @action
    setPagination = (current: number, pageSize: number) => {
        const viewModel = this.viewModel;
        viewModel.pagination = {
            current,
            pageSize
        };
        this.startQuery();
    }

    @action
    resetPageCurrent = () => {
        const viewModel = this.viewModel;
        safeEditViewModel(viewModel, 'pagination.current', 1);
    }

    @action
    setSelectRowKeys = (selectedRowKeys: any[]) => {
        const viewModel = this.viewModel;
        safeEditViewModel(viewModel, 'tableInfo.selectedRowKeys', selectedRowKeys);
    }

    @action
    startQuery = () => {
        const viewModel = this.viewModel;
        const { searchValue: { IntvDate, ...otherSearchValue }, pagination: { current, pageSize } } = viewModel;
        const [BeginIntvDate, EndIntvDate] = IntvDate as any[];

        const reqParam = {
            ...otherSearchValue,
            BeginIntvDate: BeginIntvDate ? BeginIntvDate.format('YYYY-MM-DD') : '',
            EndIntvDate: EndIntvDate ? EndIntvDate.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        transaction(async () => {
            try {
                safeEditViewModel(viewModel, 'tableInfo.loading', true);
                let resData: any = await listName(reqParam);
                const { RecordCount, RecordList } = resData.Data;

                viewModel.tableInfo = {
                    dataList: RecordList || [],
                    total: RecordCount,
                    loading: false,
                    selectedRowKeys: []
                };
            } catch (err) {
                errorHandle(err);
            } finally {
                safeEditViewModel(viewModel, 'tableInfo.loading', false);
            }
        });
    }

    @action
    destoryName = async () => {
        const viewModel = this.viewModel;
        const { tableInfo: { selectedRowKeys } } = viewModel;

        if (selectedRowKeys.length === 0) {
            message.info('请选择一条记录！');
            return;
        }

        try {
            const reqParam = {
                NameIDList: selectedRowKeys
            };

            safeEditViewModel(viewModel, 'tableInfo.loading', true);
            let resData: any = await destoryName(reqParam);
            const { BizID } = resData.Data;

            await getResAsync(getResByBizID, { BizID });

            message.success('作废平台用户成功！');
            this.startQuery();
        } catch (err) {
            errorHandle(err);
        } finally {
            safeEditViewModel(viewModel, 'tableInfo.loading', false);
        }
    }
}