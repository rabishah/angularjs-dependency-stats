import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import _ from '../utils';

import {
    Caption,
    Card,
    CardTitle,
    CardValue,
    Title,
    Monospace,
    Panel,
    SearchInput
} from '../components';

const DataTextMap = {
    'js': 'Javascript',
    'ts': 'Typescript',
    'jsTests': 'JS Tests',
    'tsTests': 'TS Tests'
};

const _getJSComponentType = ((list, type) => {
    return list.sort(function(a, b) {
        return b.deps.length - a.deps.length;
    }).filter(function(e) {
        return e.type === type;
    });
});

const _getJSDepsByPath = function(x, y) {
    return x.filter(function(a) {
        return a.path.match(y);
    });
};

class Home extends Component {
    constructor() {
        super();

        this.state = {
            searchResult: {
                term: '',
                value: []
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleInputChange(event) {
        // event.preventDefault();
    }

    handleKeyDown(event) {
        const { jsComponentList } = this.props.data;

        const term = event.target.value;
        const result = jsComponentList.filter(e => {
            return e.name.match(term);
        });

        this.setState({
            searchResult: {
                term: event.target.value,
                value: result
            }
        });
    }

    getTables(list, header, valueProperty) {
        let $list = list.map((e, idx) => (
            <tr key={idx + '__' + header}>
                <td><Monospace><Link to={"/js/" + e.name}>{e.name}</Link></Monospace></td>
                <td>{e[valueProperty]}</td>
            </tr>
        ));

        return (
            <table>
                <thead>
                    <tr>
                        <th>{header}</th>
                        <th>{list.length}</th>
                    </tr>
                </thead>
                <tbody>{$list}</tbody>
            </table>
        )
    }

    render() {
        if (!this.props.data) {
            return null;
        }

        const {counts, tsDeps, jsComponentList} = this.props.data;

        const controllers =  _getJSComponentType(jsComponentList, 'controller');
        const factories = _getJSComponentType(jsComponentList, 'factory');
        const directives = _getJSComponentType(jsComponentList, 'directive');
        const filters = _getJSComponentType(jsComponentList, 'filter');

        let $stats = Object.keys(counts).map((e, idx) => (
            <Card key={idx + '_stat-card'}>
                <CardTitle>{DataTextMap[e]}</CardTitle>
                <CardValue>{counts[e]}</CardValue>
            </Card>
        ));

        let $searchResult = this.state.searchResult.value.map((e, idx) => {
            return <div key={"search-result-" + idx}><Link to={"/js/" + e.name}>{e.name}</Link></div>
        });

        return (
            <Layout>
                <Content>
                    <Title>Alice in Wonderland</Title>
                    <Caption>Migrating Javascript files to Typescript files</Caption>

                    <CardList>{$stats}</CardList>

                    <Tables>
                        {this.getTables(_.getPriorityOnTSDeps(tsDeps), 'TS Dependencies', 'value')}
                        {this.getTables(_.getJSSubDependencies(jsComponentList), 'JS Dependencies', 'deps')}
                        {this.getTables(_.getJSOnlySubDependencies(jsComponentList), 'JS Dependencies w/o Angular deps', 'deps')}
                    </Tables>
                </Content>

                <Sidebar>
                    <SearchInputWrapper>
                        <SearchInput type="search" onChange={this.handleInputChange} onKeyDown={this.handleKeyDown} placeholder="search" />
                        {this.state.searchResult.term? <SearchResult>{$searchResult}</SearchResult> : null}
                    </SearchInputWrapper>

                    <SidebarTableWrapper>
                        <div className="s-t-header">component types</div>
                        <table>
                            <tr><td>factories</td><td>{factories.length}</td></tr>
                            <tr><td>directives</td><td>{directives.length}</td></tr>
                            <tr><td>controllers</td><td>{controllers.length}</td></tr>
                            <tr><td>filters</td><td>{filters.length}</td></tr>
                        </table>
                    </SidebarTableWrapper>

                    <div>
                        <Panel title="factories" list={factories} color="#fd79a8" />
                        <Panel title="directives" list={directives} color="#74b9ff" />
                        <Panel title="controllers" list={controllers} color="#55efc4" />
                        <Panel title="filters" list={filters} color="#fdcb6e" />
                    </div>
                </Sidebar>
            </Layout>
        );
    }
}

export default Home;

const CardList = styled.div`
    display: flex;
    margin: 40px 0;

    & > div {
        margin-right: 20px;
    }
`;
const Tables = styled.div`
    display: flex;

    table {
        margin-right: 40px;
    }

    th {
        text-align: left;
        font-weight: bold;
        padding-bottom: 20px;
    }
`;
const Layout = styled.div`
    display: flex;
    padding: 0px 0 80px 80px;
`;
const Content = styled.div`
    flex: 5;
    margin-top: 40px;
`;
const Sidebar = styled.div`
    flex:2;
    background: #f4f6f8;
    padding: 20px;
    padding-top: 0px;
`;
const SidebarTableWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;

    .s-t-header {
        text-decoration: underline;
        margin-bottom: 20px;
    }
`;
const SearchInputWrapper = styled.div`
    display:flex;
    flex-direction: column;
    margin: 40px 0;
`;
const SearchResult = styled.div`
    display: flex;
    font-size: 14px;
    flex-direction: column;
    position: absolute;
    top: 82px;
    background: #fff;
    padding: 10px 20px;
    width: 252px;
    flex-wrap: nowrap;

    div {
        word-wrap: break-word;
    }
`;
