import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import {Monospace} from './components';

const MAX = 10;
const MIN = 0;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .s-t-header {
        margin-bottom: 10px;
        font-weight: bold;
    }

    .controls {
        cursor: pointer;
        margin: 10px 0;
        padding: 5px 0;
        border-top: 1px solid #d0d0d0;

        & span {
            padding: 0 5px;
            user-select: none;
        }

        & span:hover {
            color: #27ae60;
        }
    }

    .controls .text {
        font-size: 12px;
    }
`;

const Label = styled.span`
   background: ${(props) => props.color};
   color: #fff;
   font-size: 14px;
   padding: 4px;
   border-radius: 3px;
   letter-spacing: 0.5px;
   line-height: 1.4;
`;

class Panel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            min: MIN,
            max: MAX,
            list: this.props ? this.props.list : [],
            controlSortType: 'asc',
            more: 'more'
        };

        this.onIncrease = this.onIncrease.bind(this);
        this.onDecrease = this.onDecrease.bind(this);
        this.onToggleSort = this.onToggleSort.bind(this);
        this.onToggleMore = this.onToggleMore.bind(this);
    }

    onIncrease() {
        this.setState({ max: this.state.max + 1 });
    }

    onDecrease() {
        this.setState({ max: this.state.max - 1 });
    }

    onToggleSort() {
        let type = this.state.controlSortType === 'asc' ? 'desc' : 'asc';
        this.setState({
            list: this.state.list.reverse(),
            controlSortType: type
        })
    }

    onToggleMore() {
        if (this.state.more === 'more') {
            this.setState({
                max: this.state.list.length,
                more: 'less'
            });
        } else {
            this.setState({
                max: MAX,
                more: 'more'
            });
        }
    }

    render() {
        const { title, color } = this.props;
        const { min, max, list } = this.state;

        return (
            <Wrapper>
                <div className="s-t-header"><Label color={color}>{title}</Label></div>
                <table>
                    {
                        list.slice(min, max).map((e, idx) => (
                            <tr><td><Monospace><Link to={"/js/" + e.name}>{e.name}</Link></Monospace></td><td>{e.deps.length}</td></tr>
                        ))
                    }
                </table>
                <div className="controls">
                    <span onClick={this.onIncrease}>+</span>
                    <span onClick={this.onDecrease}>-</span>
                    <span className="text" onClick={this.onToggleSort}>{this.state.controlSortType}</span>
                    <span className="text" onClick={this.onToggleMore}>{this.state.more}</span>
                </div>
            </Wrapper>
        )
    }
}

export default Panel;
