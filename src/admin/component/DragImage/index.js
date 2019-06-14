import React, { Component } from 'react';
import addImg from './images/add.png';
import minusImg from './images/minus.png';
import rightImg from './images/right.png';
import leftImg from './images/left.png';
import './index.less';
import PropTypes from 'prop-types';

class DragImage extends Component {
    constructor() {
        super();
        this.state = {
            width: 'auto',
            height: 300,
            rot: 0,
            px: 0,
            py: 0,
            isDrag: false
        };
        this.downX = 0;
        this.downY = 0;
    }

    fnDown = event => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            isDrag: true
        });
        this.downX = event.clientX;
        this.downY = event.clientY;
    };

    fnMove = (event) => {
        event.stopPropagation();
        event.persist();
        if (this.state.isDrag) {
            this.setState(state => {
                let result = {
                    px: state.px + (event.clientX - this.downX),
                    py: state.py + (event.clientY - this.downY)
                };
                this.downX = event.clientX;
                this.downY = event.clientY;
                return result;
            });
        }
    };

    fnUp = (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            isDrag: false
        });
    };

    imgToSize = (size) => {
        const img = document.getElementById('dragImg');
        let { width, height } = this.state;
        if (width === 'auto') {
            width = img.width;
        }
        if (height <= 300 && size < 0) {
            return;
        } else {
            this.setState({
                width: width * 1 + size,
                height: (height + size / width * height)
            });
        }
    }

    rotRight = () => {
        const { rot } = this.state;
        if (rot < 3) {
            this.setState({
                rot: rot + 1
            });
        } else {
            this.setState({
                rot: 0
            });
        }
    }

    rotLeft = () => {
        const { rot } = this.state;
        if (rot === 0) {
            this.setState({
                rot: 3
            });
        } else {
            this.setState({
                rot: rot - 1
            });
        }
    }

    render() {
        const { imgSrc } = this.props;
        const { px, py, width, height, rot } = this.state;
        return (
            <div>
                <div style={{ width: '100%', height: 400, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ left: px, top: py, position: 'relative' }} onMouseDown={this.fnDown} onMouseMove={this.fnMove} onMouseUp={this.fnUp}>
                        <img id='dragImg' width={width} height={height} src={imgSrc} className={`rot${rot}`} />
                    </div>
                </div>
                <div style={{ paddingTop: '15px', display: 'flex', textAlign: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <img src={addImg} onClick={this.imgToSize.bind(this, 50)} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <img src={minusImg} onClick={this.imgToSize.bind(this, -50)} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <img src={rightImg} onClick={this.rotRight} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <img src={leftImg} onClick={this.rotLeft} />
                    </div>
                </div>
            </div>
        );
    }
}

DragImage.propTypes = {
    imgSrc: PropTypes.string
};

export default DragImage;