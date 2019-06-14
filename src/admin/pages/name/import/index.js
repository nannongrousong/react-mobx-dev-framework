import React, { Component } from 'react';
import { TabWrapper } from 'ADMIN_PAGES/home';
import PropTypes from 'prop-types';
import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';
import store from 'ADMIN_STORE/name/import';

@TabWrapper('nameImpStore', new store())
class Index extends Component {
    componentDidMount() {
        if (!this.props.nameImpStore.viewModel.isDirty) {
            this.init();
        }
    }

    init() {

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

Index.propTypes = {
    nameImpStore: PropTypes.object
};

export default Index;