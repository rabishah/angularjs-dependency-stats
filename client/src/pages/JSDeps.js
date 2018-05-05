import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import brace from 'brace';
import { split as SplitEditor} from 'react-ace';


import 'brace/mode/java';
import 'brace/theme/github';

import {
    SearchInput
} from '../components';

class JSDeps extends Component {
    constructor() {
        super();

        this.state = {
            term: '',
            deps: {}
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleInputChange(event) {
        event.preventDefault();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.setState({
                term: event.target.value
            });
        }
    }

    render() {
        if (!this.props.data) {
            return null;
        }

        console.log('this', this);
        const { match } = this.props;

        return (
            <Container>
                <SearchInput
                    placeholder="js"
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleKeyDown}
                />
                <Route path={`${match.url}/:componentName`} render={(props) => <Info {...props} data={this.props.data} />} />
            </Container>
        );
    }
}

class Info extends Component {
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

    componentWillMount() {
        const { componentName } = this.props.match.params;
        const info = this.findComponent(componentName);

        if (!info) {
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
        console.log(value);
    }

    render() {
        console.log('apple', this.state);
        const {name, type} = this.state;
        return (
            <div>
                <h1>{name}</h1>
                <h2>{type}</h2>
                <EditorContainer>
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
                </EditorContainer>
            </div>
        )
    }
}

export default JSDeps;

const Container = styled.div`
    padding: 80px;
`;

const SearchInputWrapper = styled.div`
    display:flex;
    flex-direction: column;
    margin-bottom: 10px;
    padding: 20px 5px;
`;

const EditorContainer = styled.div`
    // display:flex;
    // justify-content: space-around;
`;