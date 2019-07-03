import React, { Component } from 'react';
import { TabWrapper } from '@/pages/home';
import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';
import store from '@/store/name/import';

interface IndexProp {
    nameImpStore: any;
}

@TabWrapper('nameImpStore', new store())
class Index extends Component<IndexProp> {
    componentDidMount() {
        if (!this.props.nameImpStore.viewModel.isDirty) {
            //  
        }
    }

    render() {
        const {
            nameImpStore: {
                viewModel: { searchValue, tableInfo },
                handleFormChange,
                resetForm, 
                impPrev,
                expImpPrev, 
                commitImp
            }
        } = this.props;

        return (
            <div>
                <DownTips />

                <SearchForm {...{ searchValue, handleFormChange, resetForm, expImpPrev, commitImp, impPrev }} />

                <ResTable {...{ tableInfo }} />
            </div>
        );
    }
}

export default Index;