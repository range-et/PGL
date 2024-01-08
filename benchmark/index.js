import * as d3 from 'd3';

// Generate nodes
const numNodes = 5000;
const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i }));

// Generate random links
const links = [];
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < 0.001) {
            links.push({ source: i, target: j });
        }
    }
}

// Set up SVG dimensions
const width = 800, height = 600;

// Create SVG element
const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// Define zoom and pan behavior
const zoomBehavior = d3.zoom()
    .scaleExtent([0.1, 4]) // Scale extent can be adjusted
    .on('zoom', (event) => {
        container.attr('transform', event.transform);
    });

// Create a container for zoom and pan
const container = svg.append('g');

// Apply zoom behavior to the SVG
svg.call(zoomBehavior);

// Create force simulation
const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(width / 2, height / 2));

const link = container.append('g')
    .attr("class", "links") // Add a class for styling if needed
    .selectAll('line')
    .data(links)
    .join('line')
    .style('stroke', '#aaa');

const node = container.append('g')
    .attr("class", "nodes") // Add a class for styling if needed
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .style('fill', 'blue');


// Define the tick behavior for the simulation
simulation.on('tick', () => {
    link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
});


node.call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended));

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
