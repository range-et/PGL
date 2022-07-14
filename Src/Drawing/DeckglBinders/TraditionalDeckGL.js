import {Deck} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';

class GraphDrawerDeck {
  constructor(GraphDrawerOptions3d, graphs) {
    this.canvas = GraphDrawerOptions3d.canvas;
    this.width = GraphDrawerOptions3d.width;
    this.height = GraphDrawerOptions3d.height;
    this.layerMap = new Map();
    this.deck;
    // bounds is a global parameter that we change (think about this as scale)
    this.bound = GraphDrawerOptions3d.bounds;
    // graph map is the hash map that holds all the
    // graphs that we are working with together
    this.graphs = new Map();
    // add the default graph to the graph map
    for (let i = 0; i < graphs.length; i++) {
      const g = graphs[i];
      this.graphs.set(i, g);
    }
  }

  async init() {
    const INITIAL_VIEW_STATE = {
      latitude: 37.8,
      longitude: -122.45,
      zoom: 15,
    };

    this.deck = new Deck({
      canvas: this.canvas,
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      layers: [
        new ScatterplotLayer({
          data: [
            { position: [-122.45, 37.8], color: [255, 0, 0], radius: 100 },
          ],
          getColor: (d) => d.color,
          getRadius: (d) => d.radius,
        }),
      ],
    });
  }
}

export { GraphDrawerDeck };
