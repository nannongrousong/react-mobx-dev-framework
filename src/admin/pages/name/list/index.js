import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TabWrapper } from 'ADMIN_PAGES/home';
import PropTypes from 'prop-types';
import ResTable from './resTable';
import SearchForm from './searchForm';
import store from 'ADMIN_STORE/name/list';

@TabWrapper('nameListStore', new store())
@observer
class Index extends Component {
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
        } = this.props;

        return (
            <div>
                <SearchForm {...{ searchValue, handleFormChange, resetForm, startQuery, destoryName, resetPageCurrent }} />

                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys }} />
            </div>
        );
    }
}

Index.propTypes = {
    nameListStore: PropTypes.object
};

export default Index;