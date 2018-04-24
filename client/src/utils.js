function getPriorityOnTSDeps(info) {
    var counts = {};
    info.forEach(function(i) {
        counts[i] = (counts[i] || 0) + 1;
    });

    var sortedDeps = [];
    for (var count in counts) {
        sortedDeps.push({
            name: count,
            value: counts[count]
        });
    }

    sortedDeps.sort(function(a, b) {
        return b.value - a.value;
    });


    return sortedDeps;
};

function getJSSubDependencies(info) {
    var sortedDeps = [];
    info.forEach(function(i) {
        sortedDeps.push({
            name: i.name,
            deps: i.deps.length
        })
    });

    sortedDeps.sort(function(a, b) {
        return b.deps - a.deps;
    });

    return sortedDeps;
}

function getJSOnlySubDependencies(info) {
    var jsComponents = {};

    info.forEach(function(i) {
        jsComponents[i.name] = true;
    });

    var sortedJSDeps = [];
    info.forEach(function(i) {
        const jsOnlyDeps = i.deps.filter(function(f) {
            return jsComponents[f];
        });

        sortedJSDeps.push({
            name: i.name,
            deps: jsOnlyDeps.length
        });
    });

    sortedJSDeps.sort(function(a, b) {
        return b.deps - a.deps;
    });

    return sortedJSDeps;
}

export default {
    getJSOnlySubDependencies : getJSOnlySubDependencies,
    getJSSubDependencies : getJSSubDependencies,
    getPriorityOnTSDeps : getPriorityOnTSDeps,
};