'use strict';

var shx = require('shelljs');
var path = require('path');
var express = require('express');

var _ = require('./util.js');

const baseDir = path.resolve(__dirname, '../thoughtspot/blink/app/src');

/* files info*/
const all = shx.find(baseDir);

const js  = all.filter(function(file) { return file.match(/\.js$/); });
const ts  = all.filter(function(file) { return file.match(/\.ts$/); });

const jsOnly = js.filter(function(file) { return !file.match(/\-spec.js$/); });
const tsOnly = ts.filter(function(file) { return !file.match(/\-spec.ts$/); });

const jsTests = js.filter(function(file) { return file.match(/\-spec.js$/); });
const tsTests = ts.filter(function(file) { return file.match(/\-spec.ts$/); });

/* get our Angular component types, name and deps*/
let info = [];
jsOnly.forEach(function (js) {
    info = info.concat(_.getJSContentInfo(shx.cat(js).toString()));
});

/* get TypeScript dependencies on JS component */
let tsInfo = [];
tsOnly.forEach(function (t) {
    tsInfo = tsInfo.concat(_.getTSContentInfo(shx.cat(t).toString()));
});

/* express */
const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/graph', (req, res) => res.sendFile(path.join(__dirname, 'public/graph.html')));
app.get('/info', (req, res) => res.send({
    counts: {
        js : jsOnly.length,
        ts : tsOnly.length,
        jsTests : jsTests.length,
        tsTests : tsTests.length
    },
    jsComponentList : info,
    tsDeps : tsInfo
}));

app.listen(3000, () => console.log('Application listening on port 3000!'));
