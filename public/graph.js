'use strict';


function getNodesAndEdges(type, data) {
    var nodes = [];
    var edges = [];

    data.filter(function(i) {
        return i.type === type
    }).map(function(n) {
        nodes.push({
            id: n.name,
            label: n.name,
            shape: 'circle',
            color: '#27AE60'
        });

        n.deps.forEach(function(e) {
            edges.push({
                from: n.name,
                to: e,
                color: { 
                    color: 'red'
                }
            });
        });
    });

    console.log('nodes', nodes);
    return {
        nodes: nodes,
        edges: edges
    };
}

$( document ).ready(function() {
    console.log('hello world');
    
   
    $.ajax({
        url: 'http://localhost:3000/info',
        success: function (info) {
            // var factory = transform('factory', info.jsComponentList);
            console.log('data', info);
                        console.log('info', getNodesAndEdges('factory', info.jsComponentList));
        }
    });
});
