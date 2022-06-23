class Vertex {
    constructor(data){
        // this data is an arbitrary thing with which I can create any object
        this.data = { ... data};
        // the neighbours bit is explicity set from the code outside
        this.neighbours = [];
    }
}

export {Vertex}