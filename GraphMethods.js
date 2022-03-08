// do a BFS Search Starting from some point
// searches the whole graph and returns a map of which node 
// was searched from where
function BFSSearch(G, node){
    const adj = G.get_adjacency();
    const exploredFromMap = new Map();

    const explored = [];
    const stack =[];

    // queue the first node 
    stack.push(node);
    exploredFromMap.set(node, -1);

    // search through the whole graph
    while(stack.length > 0){
        const currentNode = stack.pop()
        // add this current node to the explored list
        explored.push(currentNode);
        const neighbours = adj.get(currentNode);
        neighbours.forEach(neighbour => {
            if(!explored.includes(neighbour)){
                stack.push(neighbour);
                exploredFromMap.set(neighbour, currentNode);
            }
        });
    }

    // then return the explored from map
    return exploredFromMap
}

// do a dijkstra Search
function Dijkstra(G, Node){
    const adj = G.get_adjacency();
    const Dmap = new Map();
    // get the explored from map
    const exploredFromMap = BFSSearch(G, Node);
    // then for each element in the map go through 
    // contact trace where that element came from
    for(const n of adj.keys()){
        let i = 0;
        let exploredFrom = exploredFromMap.get(n);
        while(exploredFrom != -1){
            exploredFrom = exploredFromMap.get(exploredFrom);
            i += 1;
        }
        Dmap.set(n, i);
    }
    // now return this map 
    return Dmap;
}

// This file contains basic things like 
// Graph searches and stuff
function GraphDiameter(graph){
    // find the diameter of the graph

    // start Dijkstra from some random node 
    // search to the end
    // then search from there to the furthest point again 
    // TADA
}


// this is where the exports happen
export {GraphDiameter, Dijkstra, BFSSearch}