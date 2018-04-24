import React, { Component } from 'react';
import styled from 'styled-components';
import _ from '../utils';

import {
    Caption,
    Card,
    CardTitle,
    CardValue,
    Title,
    Link,
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
    padding: 80px 0 80px 80px;
`;
const Content = styled.div`flex: 5;`;
const Sidebar = styled.div`
    flex:2;
    background: #f4f6f8;
    padding: 20px;
`;
const SidebarTableWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .s-t-header {
        text-decoration: underline;
        margin-bottom: 10px;
        font-weight: bold;
    }
`;
const SearchInputWrapper = styled.div`
    display:flex;
    flex-direction: column;
    margin-bottom: 10px;
    padding: 20px 5px;
`;
const SearchResult = styled.div`
    display: flex;
    font-size: 14px;
    padding: 10px 5px;
    background: #fff;
    border-top: 1px solid #d8d8d8;

    .search-result {
        margin-right: 10px;
    }
`;

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
                value: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleInputChange(event) {
        event.preventDefault();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            const { jsComponentList } = this.props.data;
            this.setState({
                searchResult: {
                    term: event.target.value,
                    value: _getJSDepsByPath(jsComponentList, event.target.value).length
                }
            })
        }
    }

    getTables(list, header, valueProperty) {
        let $list = list.map((e, idx) => (
            <tr key={idx + '__' + header}>
                <td><Monospace>{e.name}</Monospace></td>
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
                    <SidebarTableWrapper>
                        <div className="s-t-header">by path</div>
                        <SearchInputWrapper>
                            <SearchInput type="search" onChange={this.handleInputChange} onKeyDown={this.handleKeyDown} placeholder="search by path" />
                            {this.state.searchResult.term ? (
                                <SearchResult>
                                    <div className="search-result">{this.state.searchResult.term}</div>
                                    <div className="search-value">{this.state.searchResult.value}</div>
                                </SearchResult>
                            ) : null}
                        </SearchInputWrapper>


                        <table>
                            <tr><td>modules</td><td>{_getJSDepsByPath(jsComponentList, 'modules').length}</td></tr>
                            <tr><td>base</td><td>{_getJSDepsByPath(jsComponentList, 'base').length}</td></tr>
                            <tr><td>common</td><td>{_getJSDepsByPath(jsComponentList, 'common').length}</td></tr>
                            <tr><td>widgets</td><td>{_getJSDepsByPath(jsComponentList, 'widgets').length}</td></tr>
                            <tr><td>style-guide</td><td>{_getJSDepsByPath(jsComponentList, 'style-guide').length}</td></tr>
                            <tr><td>test</td><td>{_getJSDepsByPath(jsComponentList, 'test').length}</td></tr>
                        </table>
                    </SidebarTableWrapper>

                    <SidebarTableWrapper>
                        <div className="s-t-header">by angular component types</div>
                        <table>
                            <tr><td>factories</td><td>{factories.length}</td></tr>
                            <tr><td>directives</td><td>{directives.length}</td></tr>
                            <tr><td>controllers</td><td>{controllers.length}</td></tr>
                            <tr><td>filters</td><td>{filters.length}</td></tr>
                        </table>
                    </SidebarTableWrapper>

                    <div>
                        <Panel title="factories" list={factories} />
                        <Panel title="directives" list={directives} />
                        <Panel title="controllers" list={controllers} />
                        <Panel title="filters" list={filters} />
                    </div>
                </Sidebar>
            </Layout>
        );
    }
}

export default Home;
