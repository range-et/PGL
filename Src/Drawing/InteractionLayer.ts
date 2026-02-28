/**
 * Opt-in interaction layer for PGL: node and edge picking via Three.js Raycaster.
 * Callbacks receive graph details (node data, neighbours, edge endpoints).
 * 100% opt-in — no interaction unless enableInteraction() is called.
 */

import * as THREE from "three";
import type Graph from "../Core/Graph";
import type Point from "../HelperClasses/Point";

/** Details passed to node click/hover callbacks */
export interface NodePickDetails {
  nodeId: number;
  data: unknown;
  neighbours: number[];
  position?: Point;
}

/** Details passed to edge click/hover callbacks */
export interface EdgePickDetails {
  edgeId: number;
  start: number;
  end: number;
  data: unknown;
}

/** Options for enableInteraction */
export interface InteractionOptions {
  graph: Graph;
  onNodeClick?: (details: NodePickDetails) => void;
  onEdgeClick?: (details: EdgePickDetails) => void;
  onNodeHover?: (details: NodePickDetails | null) => void;
  onEdgeHover?: (details: EdgePickDetails | null) => void;
  hoverEnabled?: boolean;
}

function resolveNodeId(intersection: THREE.Intersection): number | null {
  const obj = intersection.object;

  // Points: use label attribute
  if (obj instanceof THREE.Points) {
    const geom = obj.geometry;
    const labelAttr = geom?.attributes?.label as THREE.BufferAttribute | undefined;
    if (labelAttr && intersection.index != null) {
      const arr = labelAttr.array as Int32Array;
      return arr[intersection.index] ?? null;
    }
    return null;
  }

  // InstancedMesh: use userData.nodeIds
  if (obj instanceof THREE.InstancedMesh && intersection.instanceId != null) {
    const nodeIds = (obj.userData as { nodeIds?: number[] }).nodeIds;
    if (nodeIds && intersection.instanceId < nodeIds.length) {
      return nodeIds[intersection.instanceId];
    }
    return null;
  }

  return null;
}

function resolveEdgeId(intersection: THREE.Intersection): number | null {
  const obj = intersection.object;
  const edgeId = (obj.userData as { edgeId?: number }).edgeId;
  return edgeId != null ? edgeId : null;
}

function buildNodePickDetails(graph: Graph, nodeId: number): NodePickDetails {
  const node = graph.nodes.get(nodeId);
  const pmap = graph.get_position_map();
  return {
    nodeId,
    data: node?.data ?? {},
    neighbours: node?.neighbours?.slice() ?? [],
    position: pmap.get(nodeId),
  };
}

function buildEdgePickDetails(graph: Graph, edgeId: number): EdgePickDetails | null {
  const edge = graph.edges.get(edgeId);
  if (!edge) return null;
  return {
    edgeId,
    start: edge.start,
    end: edge.end,
    data: edge.data ?? {},
  };
}

/**
 * Interaction layer: raycasting + callbacks for node/edge picking.
 * Used internally by GraphDrawer3d.enableInteraction().
 */
export class InteractionLayer {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private domElement: HTMLElement;
  private graph: Graph;
  private options: InteractionOptions;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private hoverEnabled: boolean;
  private lastHoverNodeId: number | null = null;
  private lastHoverEdgeId: number | null = null;

  private boundOnClick: (e: MouseEvent) => void;
  private boundOnPointerMove: (e: PointerEvent) => void;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    domElement: HTMLElement,
    graph: Graph,
    options: InteractionOptions
  ) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    this.graph = graph;
    this.options = options;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoverEnabled = options.hoverEnabled !== false;

    // Widen Line threshold for easier edge picking
    this.raycaster.params.Line = { threshold: 5 };
    // Widen Points threshold so point clouds are pickable (default 1 is too small for scaled graphs)
    this.raycaster.params.Points = { threshold: 10 };

    this.boundOnClick = this.onClick.bind(this);
    this.boundOnPointerMove = this.onPointerMove.bind(this);

    domElement.addEventListener("click", this.boundOnClick);
    if (this.hoverEnabled) {
      domElement.addEventListener("pointermove", this.boundOnPointerMove);
    }
  }

  dispose(): void {
    this.domElement.removeEventListener("click", this.boundOnClick);
    this.domElement.removeEventListener("pointermove", this.boundOnPointerMove);
  }

  private getMouseNDC(event: MouseEvent | PointerEvent): void {
    const el = this.domElement as HTMLCanvasElement;
    // Use offsetX/offsetY when target is canvas - avoids border/scroll/transform offsets
    const target = event.target as HTMLElement;
    if (target === el) {
      this.mouse.x = (event.offsetX / el.offsetWidth) * 2 - 1;
      this.mouse.y = -(event.offsetY / el.offsetHeight) * 2 + 1;
    } else {
      const rect = el.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
  }

  private pick(): { nodeId: number | null; edgeId: number | null } {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.scene, true);

    let nodeId: number | null = null;
    let edgeId: number | null = null;
    let nodeDistance = Infinity;
    let edgeDistance = Infinity;

    for (const hit of intersects) {
      const nid = resolveNodeId(hit);
      const eid = resolveEdgeId(hit);
      if (nid != null && hit.distance < nodeDistance) {
        nodeId = nid;
        nodeDistance = hit.distance;
      }
      if (eid != null && hit.distance < edgeDistance) {
        edgeId = eid;
        edgeDistance = hit.distance;
      }
    }

    // Prefer node over edge when both hit (node is usually in front)
    if (nodeId != null && edgeId != null && nodeDistance <= edgeDistance) {
      edgeId = null;
    } else if (nodeId != null && edgeId != null) {
      nodeId = null;
    }

    return { nodeId, edgeId };
  }

  private onClick(event: MouseEvent): void {
    this.getMouseNDC(event);
    const { nodeId, edgeId } = this.pick();

    if (nodeId != null && this.options.onNodeClick) {
      this.options.onNodeClick(buildNodePickDetails(this.graph, nodeId));
    }
    if (edgeId != null && this.options.onEdgeClick) {
      const details = buildEdgePickDetails(this.graph, edgeId);
      if (details) this.options.onEdgeClick(details);
    }
  }

  private onPointerMove(event: PointerEvent): void {
    this.getMouseNDC(event);
    const { nodeId, edgeId } = this.pick();
    this.fireHoverCallbacks(nodeId, edgeId);
  }

  private fireHoverCallbacks(nodeId: number | null, edgeId: number | null): void {

    if (this.options.onNodeHover) {
      if (nodeId != null) {
        if (nodeId !== this.lastHoverNodeId) {
          this.lastHoverNodeId = nodeId;
          this.options.onNodeHover(buildNodePickDetails(this.graph, nodeId));
        }
      } else {
        if (this.lastHoverNodeId != null) {
          this.lastHoverNodeId = null;
          this.options.onNodeHover(null);
        }
      }
    }

    if (this.options.onEdgeHover) {
      if (edgeId != null) {
        if (edgeId !== this.lastHoverEdgeId) {
          this.lastHoverEdgeId = edgeId;
          const details = buildEdgePickDetails(this.graph, edgeId);
          if (details) this.options.onEdgeHover(details);
        }
      } else {
        if (this.lastHoverEdgeId != null) {
          this.lastHoverEdgeId = null;
          this.options.onEdgeHover(null);
        }
      }
    }
  }
}
