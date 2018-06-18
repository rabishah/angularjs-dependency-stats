'use strict';

function getJSContentInfo(content, path) {
    const info = [];
    const regExp1 = /legacy\.app\.((?!.*?component).*)\(\'(.*?),((.|\n)*?)function\s*[^\(]*\(\s*([^\)]*)\)/g;

    let match = regExp1.exec(content);

    while (match != null) {
        info.push({
            type: match[1],
            name: match[2].replace("\'", ''),
            deps: match[5].split(',').map(function (s) {
                return s.trim('\s', '').replace('\n', '')
            }),
            path: path
        });

        match = regExp1.exec(content);
    };

    //console.log(info);

    return info;
}

function getTSContentInfo(content) {
    const info = [];
    const regExp = /ngRequire\((.*)\)/g;

    let match = regExp.exec(content);

    while (match != null) {
        info.push(match[1].replace(/\'/g, ''));
        match = regExp.exec(content);
    }

    // console.log(info);

    return info;
}

module.exports = {
    getJSContentInfo : getJSContentInfo,
    getTSContentInfo : getTSContentInfo
};
