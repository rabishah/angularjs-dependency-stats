'use strict';

var shx = require('shelljs');
var path = require('path');
var express = require('express');

var _ = require('./util.js');

if (!process.argv[2]) {
    console.error('Please enter your AngularJS project folder');
    return process.exit(1);
}

const baseDir = path.resolve(__dirname, process.argv[2]);

const filter = function(x, y) {
    return x.filter(function(a) {
        return a.match(y);
    });
};

const getDeps = function (array, fn) {
    return array.reduce(function (accumulator, currentValue) {
        return accumulator.concat(fn(shx.cat(currentValue).toString()));
    }, []);
};

/* filter files by js, ts and tests */
const all = shx.find(baseDir);

const js = filter(all, /\.js$/);
const ts = filter(all, /\.ts$/);

const jsOnly = filter(js, /(?<!\-spec.js)$/);
const tsOnly = filter(ts, /(?<!\-spec.ts)$/);

const jsTests = filter(js, /\-spec.js$/);
const tsTests = filter(ts, /\-spec.ts$/);

const jsInfo = getDeps(jsOnly, _.getJSContentInfo);
const tsInfo = getDeps(tsOnly, _.getTSContentInfo);

/* express */
const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/graph', (req, res) => res.sendFile(path.join(__dirname, 'public/graph.html')));
app.get('/info', (req, res) => res.send({
    counts: {
        js: jsOnly.length,
        ts: tsOnly.length,
        jsTests: jsTests.length,
        tsTests: tsTests.length
    },
    jsComponentList: jsInfo,
    tsDeps: tsInfo
}));

app.listen(3000, () => console.log('Application listening on port 3000!'));
