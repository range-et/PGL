import { Graph } from "./Graph.js";
import * as GraphMethods from "./GraphMethods.js";
import * as SampleData from "./DataLoader.js";
import * as Constructors from "./GraphConstructors.js";
import * as Drawing from "./Drawing.js";
import * as Geometry from "./HelperClasses/GeometryHelpers.js";
import * as Utilities from "./HelperClasses/Utilities.js";
import * as threeDWrapper from "./ThreeJSDrawer.js";
import * as GraphDrawer from "./GraphDawer.js";


function logStatus(){
  console.log("PGL has loaded properly");
}

// this is where I bundle everything up and export it
const PGL = {
  Graph,
  Geometry,
  GraphMethods,
  SampleData,
  Constructors,
  Drawing,
  Utilities,
  threeDWrapper,
  GraphDrawer,
  logStatus
};

export {PGL as pgl}; 
