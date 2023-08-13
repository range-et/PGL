## Summary

The Plebian Graph Library (PGL) is an advanced software library designed to facilitate the visualisation and analysis of large-scale network data. Leveraging the power of WebGL, PGL offers an efficient and interactive solution for visualizing network data in web browsers. Whether dealing with local datasets or data retrieved from APIs, PGL provides a versatile platform for conducting extensive network simulations, physical modelling, and immersive visualizations. With a rich set of features, including graph condensation based on selected criteria, randomised edge pruning in highly connected graphs, and support for diverse visualisation techniques like network diffusions and Kamada Kawai layouts, PGL empowers users to gain valuable insights from complex network structures.

## Statement of need

The development of the Plebian Graph Library (PGL) addresses several critical needs in large-scale graph data visualisation. Existing software solutions for visualising such datasets are limited to local machine installations, which restricts accessibility and compatibility across various devices. Additionally, these platforms often cater to smaller datasets, lacking the scalability to analyse complex network structures. Furthermore, most available visualisation tools primarily employ 2D representations and rely on SVG-based graphics, imposing performance limitations.
The emergence of PGL fills this gap by providing a browser-based solution that leverages the power of WebGL and Google's Web GPU technology. This advancement offers PGL high-performance capabilities for visualising and analysing large-scale graph data. By utilizing WebGL, PGL surpasses the limitations of traditional 2D representations and SVG graphics, enabling a more comprehensive range of data stratification methods and facilitating more immersive and interactive visualizations.
The need for PGL is further reinforced by recent advancements in web technologies, particularly WebGL and Google's Web GPU. These advancements have significantly improved the performance and efficiency of browser-based applications, making it possible to develop a high-performance library like PGL. By harnessing these technologies, PGL enables users to access and explore large-scale graph data visualisations through web browsers, increasing accessibility and empowering researchers, data scientists, and analysts to gain valuable insights from complex network structures.
In summary, the development of PGL addresses the critical need for a browser-based solution that supports large-scale graph data visualisation. By utilizing WebGL and taking advantage of recent advancements in web technologies, PGL offers enhanced accessibility, scalability, and performance capabilities, empowering users to effectively analyze and visualize complex network structures on a wide range of devices.

## Usage
Existing network visualisation libraries like NetworkX dictated the semantics of the graph library and borrowed some of the semantic ideas from three JS. The process is to define a Graph Object made of nodes and edges. Then modify this graph based on some set of properties. Then update the relevant settings. And lastly, to visualise the nodes, either as point clouds, boxes or cylinders, and to draw out the edges (bundled or not) lines.
Here is an illustrated walkthrough of a simple set-up given a predefined set of “nodes” and “edges”.

## Documentation

Package documentation is available on GitHub for the package.
Guides for general guides and detailed descriptors of all the functions are also included. Further documentation is available at https://www.plebiangraphlibrary.com/
Acknowledgements
This work is funded by the Geometry Lab under the Laboratory of design technologies at the Graduate School of Design at Harvard University.

## References

Aric A. Hagberg, Daniel A. Schult and Pieter J. Swart, “Exploring network structure, dynamics, and function using NetworkX”, in Proceedings of the 7th Python in Science Conference (SciPy2008), Gäel Varoquaux, Travis Vaught, and Jarrod Millman (Eds), (Pasadena, CA USA), pp. 11–15, Aug 2008

Bostock, Mike. "D3.js - Data-Driven Documents." 2012. http://d3js.org/. 

Haldar, Indrajeet. "On the mathematics of Memetics", Master's thesis, Harvard Graduate
School of Design. 2022.

ThreeJS, Threejs website (Threejs.org), https://github.com/mrdoob/three.js/, accessed 2 June 2023, <https://threejs.org/>.
