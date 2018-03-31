'use strict';

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

function addStat($elm, name, value) {
    $elm.append('<div class="card--title">' + name + '</div>');
    $elm.append('<div class="card--value">' + value + '</div>');
}

$( document ).ready(function() {
    var $jsStats = $('#stats-js'); 
    var $tsStats = $('#stats-ts');
    var $jsTestStats = $('#stats-js-test');
    var $tsTestStats = $('#stats-ts-test');

    var $jsSubDeps = $('#js-sub-deps');
    var $jsOnlySubDeps = $('#js-only-sub-deps');
    var $jsByTypes = $('#js-by-types');
    var $angularTypesOption = $('#angular-types-option');

    $('#second-page').hide();

    $('#more').click(function() {
        $('#first-page').hide();
        $('#second-page').show();
    });

    $('#back').click(function() {
        $('#first-page').show();
        $('#second-page').hide();
    }); 

    $.ajax({
        url: 'http://localhost:3000/info',
        success: function(info) {
            console.log('info', info);
            addStat($jsStats, 'Javascript', info.counts.js);
            addStat($tsStats, 'Typescript', info.counts.ts);
            addStat($jsTestStats, 'JS Tests', info.counts.jsTests);
            addStat($tsTestStats, 'TS Tests', info.counts.tsTests);


            var $tsDeps = $('#ts-deps');
            $tsDeps.append('<thead><tr><td>Angular component referenced in TS</td><tr></thead>');
            $tsDeps.append('<tr><td class="table--total">Total</td><td class="strong">' + getPriorityOnTSDeps(info.tsDeps).length + '</td><tr>');
            getPriorityOnTSDeps(info.tsDeps).forEach(function(s) {
                $tsDeps.append('<tr><td>' + s.name + '</td><td>' + s.value + '</td></tr>');
            });

            $jsSubDeps.append('<thead><tr><td>Angular component with sub dependencies</td><tr></thead>');
            $jsSubDeps.append('<tr><td class="table--total">Total</td><td class="strong">' + getJSSubDependencies(info.jsComponentList).length + '</td><tr>');
            getJSSubDependencies(info.jsComponentList).forEach(function(s) {
                $jsSubDeps.append('<tr><td>' + s.name + '</td><td>' + s.deps + '</td></tr>');
            });

            $jsOnlySubDeps.append('<thead><tr><td>Angular component with JS only sub dependencies</td><tr></thead>');
            $jsOnlySubDeps.append('<tr><td class="table--total">Total</td><td class="strong">' + getJSOnlySubDependencies(info.jsComponentList).length + '</td><tr>');
            getJSOnlySubDependencies(info.jsComponentList).forEach(function(s) {
                $jsOnlySubDeps.append('<tr><td>' + s.name + '</td><td>' + s.deps + '</td></tr>');
            });

            // Second Page
            info.jsComponentList.sort(function(a, b) {
                return b.deps.length - a.deps.length;
            }).filter(function(e) {
                return e.type === $angularTypesOption.val();
            }).forEach(function(e) {
                $jsByTypes.append('<tr><td>' + e.name + '</td><td>' + e.deps.length + '</td>' + '<td style="word-wrap: break-word;font-family: monospace; padding-bottom: 10px;">' + e.deps + '</td>');
            });

            $angularTypesOption.on('change', function() {
                $jsByTypes.find("tr:not(:first)").remove();

                info.jsComponentList.sort(function(a, b) {
                    return b.deps.length - a.deps.length;
                }).filter(function(e) {
                    return e.type === $angularTypesOption.val();
                }).forEach(function(e) {
                    $jsByTypes.append('<tr><td>' + e.name + '</td><td>' + e.deps.length + '</td>' + '<td style="word-wrap: break-word;font-family: monospace; padding-bottom:10px;">' + e.deps + '</td>');
                }).sort(function(a, b) {
                    return a.deps.length - b.deps.length;
                });
            });
        }
    });
});
