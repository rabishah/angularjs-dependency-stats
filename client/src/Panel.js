import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {Monospace} from './components';

const MAX = 10;
const MIN = 0;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .s-t-header {
        text-decoration: underline;
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

class Panel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            min: MIN,
            max: MAX,
            list: this.props ? this.props.list : [],
            controlSortType: 'asc'
        };

        this.onIncrease = this.onIncrease.bind(this);
        this.onDecrease = this.onDecrease.bind(this);
        this.onToggleSort = this.onToggleSort.bind(this);
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

    render() {
        const { title } = this.props;
        const { min, max, list } = this.state;

        return (
            <Wrapper>
                <div className="s-t-header">{title}</div>
                <table>
                    {
                        list.slice(min, max).map((e, idx) => (
                            <tr><td><Monospace>{e.name}</Monospace></td><td>{e.deps.length}</td></tr>
                        ))
                    }
                </table>
                <div className="controls">
                    <span onClick={this.onIncrease}>+</span>
                    <span onClick={this.onDecrease}>-</span>
                    <span className="text" onClick={this.onToggleSort}>{this.state.controlSortType}</span>
                </div>
            </Wrapper>
        )
    }
}

export default Panel;
