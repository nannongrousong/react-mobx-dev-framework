import { observable, action, configure } from 'mobx';
import { message } from 'antd';
import { createViewModel } from 'mobx-utils';
import { safeEditViewModel } from '../utils';
import { impPrev, getResByBizID, expImpPrev, commitImp } from 'ADMIN_SERVICE/Name';
import { getAliData } from 'ADMIN_SERVICE/AliyunService';
import { errorHandle, getResAsync } from 'ADMIN_UTILS/index';

configure({ enforceActions: 'observed' });

class View {
    @observable
    searchValue = {
        SheetName: 'sheet1',
        ImportFile: []
    }

    @observable
    tableInfo = {
        dataList: [],
        loading: false
    }

    //  导入任务ID。在提交保存后需清空
    @observable
    ImportBizID = '';
}

export default class Store {
    viewModel = createViewModel(new View());

    @action
    resetForm = () => {
        const viewModel = this.viewModel;
        viewModel.reset();
    }

    @action
    handleFormChange = (changedValues, allValues) => {
        const viewModel = this.viewModel;
        const { ImportFile, ...otherVal } = allValues;

        viewModel.searchValue = {
            ...viewModel.searchValue,
            ImportFile: Array.isArray(ImportFile) ? ImportFile : ImportFile.fileList,
            ...otherVal
        };
    }

    @action
    impPrev = async () => {
        const viewModel = this.viewModel;
        const { searchValue: { SheetName, ImportFile } } = viewModel;

        const reqParam = {
            SheetName,
            BucketKey: ImportFile[0].response.bucket,
            FileName: ImportFile[0].response.uploadName
        };

        try {
            safeEditViewModel(viewModel, 'tableInfo.loading', true);
            let resData = await impPrev(reqParam);
            const { BizID } = resData.Data;
            resData = await getResAsync(getResByBizID, { BizID });

            const { FileUrl } = resData;
            resData = await getAliData(FileUrl);

            const { ItemList } = resData;
            safeEditViewModel(viewModel, 'tableInfo.dataList', ItemList || []);
            safeEditViewModel(viewModel, 'ImportBizID', BizID);
        } catch (err) {
            errorHandle(err);
        } finally {
            safeEditViewModel(viewModel, 'tableInfo.loading', false);
        }
    }

    @action
    expImpPrev = async () => {
        const viewModel = this.viewModel;
        const { ImportBizID } = viewModel;

        if(!ImportBizID) {
            message.info('请先导入数据！');
            return;
        }

        try {
            const reqParam = {
                ImportBizID
            };

            let resData = await expImpPrev(reqParam);
            const { BizID } = resData.Data;

            resData = await getResAsync(getResByBizID, { BizID });
            const { FileUrl } = resData;
            window.open(FileUrl);
        } catch (err) {
            errorHandle(err);
        }
    }

    @action
    commitImp = async () => {
        const viewModel = this.viewModel;
        const { ImportBizID } = viewModel;

        if(!ImportBizID) {
            message.info('请先导入数据！');
            return;
        }

        try {
            const reqParam = {
                ImportBizID
            };

            safeEditViewModel(viewModel, 'tableInfo.loading', true);
            let resData = await commitImp(reqParam);
            const { BizID } = resData.Data;

            await getResAsync(getResByBizID, { BizID });

            message.success('提交保存成功！');
            safeEditViewModel(viewModel, 'tableInfo.dataList', []);
            safeEditViewModel(viewModel, 'ImportBizID', '');
        } catch (err) {
            errorHandle(err);
        } finally {
            safeEditViewModel(viewModel, 'tableInfo.loading', false);
        }
    }
}