import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TabWrapper } from '@/pages/home';
import ResTable from './resTable';
import SearchForm from './searchForm';
import store from '@/store/name/list';

interface IndexProp {
    nameListStore: any;
}

@TabWrapper('nameListStore', new store())
@observer
class Index extends Component<IndexProp> {
    componentDidMount() {
        if (!this.props.nameListStore.viewModel.isDirty) {
            this.init();
        }
    }

    init() {
        this.props.nameListStore.startQuery();
    }

    render() {
        const {
            nameListStore: {
                viewModel: { searchValue, tableInfo, pagination },
                handleFormChange,
                resetForm,
                startQuery,
                destoryName,
                setPagination,
                setSelectRowKeys,
                resetPageCurrent
            }
        } = this.props as any;

        return (
            <div>
                <SearchForm {...{ searchValue, handleFormChange, resetForm, startQuery, destoryName, resetPageCurrent }} />

                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys }} />
            </div>
        );
    }
}

export default Index;