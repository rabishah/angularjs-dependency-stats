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
        return accumulator.concat(fn(shx.cat(currentValue).toString(), currentValue));
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

app.get('/file', (req, res) => {
    const path = JSON.parse(req.query.path);
    res.send({ 'info': shx.cat(path).toString() });
});

app.get('/compile', (req, res) => {
    const path = JSON.parse(req.query.path);
    const { stdout, stderr, code } = shx.exec('npm run compile ' + path, { silent: true });
    if (code === 0) {
        res.send({ info: shx.cat(path.replace(/.js$/g, '.ts')).toString()});
        shx.rm('rf', path.replace(/.js$/g, '.ts'));
    } else {
        res.send({'info': stdout});
    }
});

app.listen(5000, () => console.log('Application listening on port 5000!'));
