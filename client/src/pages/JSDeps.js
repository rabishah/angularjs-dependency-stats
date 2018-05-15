import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import brace from 'brace';
import { split as SplitEditor} from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

import {Monospace} from '../components';

class JSDeps extends Component {
    render() {
        if (!this.props.data) {
            return null;
        }

        const { match } = this.props;

        return (
            <Container>
                <Route path={`${match.url}/:componentName`} render={(props) => <Editor {...props} data={this.props.data} />} />
            </Container>
        );
    }
}

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.onEditorChange = this.onEditorChange.bind(this);
    }

    findComponent(componentName) {
        const { jsComponentList } = this.props.data;

        const index = jsComponentList.findIndex(e => e.name === componentName);
        if (index === -1) {
            return null;
        }

        return jsComponentList[index];
    }

    getFileSource = async (path) => {
        const response = await fetch('/file?path=' + JSON.stringify(path));
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    }

    getTS = async (path) => {
        const response = await fetch('/compile?path=' + JSON.stringify(path));
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    }

    componentWillReceiveProps(nextProps) {
        const { componentName } = nextProps.match.params;
        this.loadInfo(componentName);
    }

    componentWillMount() {
        const { componentName } = this.props.match.params;
        this.loadInfo(componentName);
    }

    loadInfo(componentName) {
        const info = this.findComponent(componentName);
        if (!info || info.type !== "factory") {
            return this.setState({
                'invalid': true
            });
        }

        this.setState(info);

        this.getFileSource(info.path)
            .then(response => this.setState({ file: response }))
            .catch(error => console.log(error));

        this.getTS(info.path)
            .then(response => this.setState({ ts: response }))
            .catch(error => console.log(error));
    }

    onEditorChange(value) {
        // do nothing
    }

    render() {
        const {name, type, deps} = this.state;

        let $deps = [], $tsDeps = [];
        if (deps) {
            $deps = deps.filter((e, idx) => {
                var comp = this.findComponent(e);
                if (comp && comp.type === 'factory') {
                    return comp;
                }
            }).map((e, idx) => (
                <li key={"link-deps-" + idx}><Monospace><Link to={"/js/" + e}>{e}</Link></Monospace></li>
            ));

            $tsDeps = deps.filter((e, idx) => {
                var comp = this.findComponent(e);
                if (comp === null && e[0] !== '$') {
                    return true;
                }
            }).map((e, idx) => (
                <li key={"link-ts-module-deps-" + idx}><Monospace>{e}</Monospace></li>
            ));
        }

        if (this.state.invalid) {
            return (
                <Title>Restricted to factories only.</Title>
            )
        }

        return (
            <div>
                <Title>{name}</Title>
                <List><Heading>factory dependencies </Heading>{$deps.length ? $deps : '0'}</List>
                <List><Heading>Typescript modules</Heading>{$tsDeps.length ? $tsDeps : '0'}</List>
                <Label>{type}</Label>
                <SplitEditor
                    mode="javascript"
                    theme="github"
                    splits={2}
                    orientation="beside"
                    value={[this.state.file ? this.state.file.info : '', this.state.ts ? this.state.ts.info : '']}
                    name="ace-edito"
                    width="100%"
                    height="900px"
                    editorProps={{$blockScrolling: true}}
                />
            </div>
        )
    }
}

export default JSDeps;

const Container = styled.div`
    padding: 80px;
`;

const Label = styled.span`
    background: #fd79a8;
    font-size: 14px;
    color: #fff;
    padding: 5px;
    border-radius: 6px;
`;

const List = styled.ul`
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;

    li {
        margin-right: 5px;
        margin-bottom: 5px;
    }
`;

const Title = styled.h1`
    font-size: 32px;
`;

const Heading = styled.span`
    text-transform: lowercase;
    line-height: 1.5;
    margin-right: 5px;
`;