import { expect, it } from 'vitest';
import DataLoader from '../../Src/SampleData/DataLoader';
import GraphMethods from '../../Src/GraphAlgorithms/GraphMethods';

it('preserves parsed graph structure, positions, matrix order and reachable distances', async () => {
  const graph = await DataLoader.LoadGraphFromEdgeListText('# sparse IDs, duplicate and self edges\n10 20\n20 30\n10 20\n30 30\n80 90\n');
  expect({
    nodes: [...graph.nodes.keys()],
    edges: [...graph.edges].map(([key, edge]) => [key, edge.start, edge.end]),
    adjacency: [...graph.get_adjacency()],
    matrix: Array.from(graph.get_adjacency_matrix().matrix),
    positions: [...graph.get_position_map()].map(([key, p]) => [key, p.x, p.y, p.z]),
    distances: [...await GraphMethods.Dijkstra(graph, 10)],
  }).toMatchSnapshot();
});
