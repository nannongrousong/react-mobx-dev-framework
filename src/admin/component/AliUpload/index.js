import React, { Component } from 'react';
import getOSSClient from './getOSSClient';
import { Upload, Icon, Modal, message, Button } from 'antd';
import DragImage from 'ADMIN_COMPONENT/DragImage';
import PropTypes from 'prop-types';
import { errorHandle } from 'ADMIN_UTILS/index';

class AliUpload extends Component {
    state = {
        isShowPreModal: false,
        prevImgSrc: ''
    }

    validatFile = (file) => {
        const { maxSize, accept } = this.props;

        if (file && maxSize && file.size > maxSize) {
            return `文件必须小于 ${maxSize} 字节`;
        }

        //  file.type 返回值有bug xlsx、ppt、exe时返回为空 只能默认通过
        if (file && file.type && accept && !accept.split(',').includes(file.type)) {
            return '不支持当前文件类型上传';
        }

        return '';
    }

    //  https://github.com/react-component/upload#customrequest
    customRequest = async ({ file, onSuccess, onError }) => {
        try {
            const { oss } = this.props;
            const ossClient = await getOSSClient({
                bucket: oss.bucket
            });

            const uploadName = oss.path + new Date().getTime().toString() + Math.ceil(Math.random(1) * 10000);
            const uploadRes = await ossClient.multipartUpload(uploadName, file, {
                parallel: 4,
                partSize: 1024 * 1024
            });

            file.uploadName = uploadName;
            onSuccess({
                ...uploadRes.res,
                bucket: oss.bucket,
                uploadName
            }, file);
        } catch (err) {
            onError(err);
            errorHandle(err);
        }
    };

    closePreModal = () => {
        this.setState({
            isShowPreModal: false
        });
    }

    handleBeforeUpload = (file) => {
        //  直接返回false并不能阻止其上传 https://github.com/ant-design/ant-design/issues/8020
        return new Promise((resolve, reject) => {
            const errInfo = this.validatFile(file);
            if (errInfo) {
                message.error(errInfo);
                reject(errInfo);
            } else {
                resolve();
            }
        });
    }

    handlePreview = (file) => {
        const { enablePreview } = this.props;
        if (!enablePreview) {
            return;
        }
        this.setState({
            prevImgSrc: file.url || file.thumbUrl,
            isShowPreModal: true
        });
    }

    handleRemove = async (file) => {
        const { oss } = this.props;
        try {
            const ossClient = await getOSSClient({
                bucket: oss.bucket
            });
            await ossClient.deleteMulti([file.originFileObj.uploadName]);
        } catch (err) {
            //  文件删除失败不做处理 忽略...   
        }
    }

    handleChange = (file, fileList, event) => {
        const { onChange } = this.props;
        onChange && onChange(file, fileList, event);
    }

    render() {
        const { isShowPreModal, prevImgSrc } = this.state;
        const { maxCount, fileList, defaultFileList } = this.props;

        const uploadButton = (
            <Button>
                <Icon type="upload" /> 上传
            </Button>
        );

        return (
            <div>
                <Upload
                    {...this.props}
                    beforeUpload={this.handleBeforeUpload}
                    onRemove={this.handleRemove}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    customRequest={this.customRequest} >
                    {
                        (fileList || defaultFileList).length >= maxCount
                            ? null
                            : (this.props.children || uploadButton)
                    }
                </Upload>

                <Modal visible={isShowPreModal} footer={null} onCancel={this.closePreModal} title='图片预览'>
                    <DragImage imgSrc={prevImgSrc} />
                </Modal>
            </div>
        );
    }
}

AliUpload.defaultProps = {
    maxCount: 1,
    //  允许预览
    enablePreview: false
};

AliUpload.propTypes = {
    maxSize: PropTypes.number,
    accept: PropTypes.string,
    oss: (props, propName, componentName) => {
        if (!props[propName]) {
            return new Error(`请为组件${componentName}提供正确的${propName}值！`);
        }

        if (!props[propName]['bucket']) {
            return new Error(`组件${componentName}的属性${propName}值需要buckte参数！`);
        }
    },
    disabled: PropTypes.bool,
    maxCount: PropTypes.number,
    fileList: (props, propName, componentName) => {
        const { fileList, defaultFileList } = props;
        if (fileList && defaultFileList) {
            return new Error('antd-Upload组件请不用同时使用fileList和defaultFileList属性，请参考https://github.com/ant-design/ant-design/issues/4979');
        }

        if (fileList && !Array.isArray(fileList)) {
            return new Error(`请为组件${componentName}的属性fileList提供有效的Array值！`);
        }

        if (defaultFileList && !Array.isArray(defaultFileList)) {
            return new Error(`请为组件${componentName}的属性defaultFileList提供有效的Array值！`);
        }

        if (!fileList && !defaultFileList) {
            return new Error(`请为组件${componentName}提供fileList或defaultFileList！`);
        }
    },
    defaultFileList: PropTypes.array,
    //  其实最佳实践是Upload为受控组件，onChange应该必有，由于用了Form包裹，onChange事件实际上已被拦截
    onChange: PropTypes.func,
    enablePreview: PropTypes.bool,
    children: PropTypes.node
};

export default AliUpload;