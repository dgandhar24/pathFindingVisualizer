let GRID = [];                      //Grid for storing <tr>(row) elements which contains <td>(columns) elements.
let VISITED_NODES_IN_ORDER = [];    //storing visited nodes in order
let PATH_NODES_REVERSE = [];        //storing path traces in reverse order


let N, M;
let tile_side = 25; // w = h= 15px of tile
let start_x, start_y, end_x, end_y;

let MOUSEDOWN = false;
let bfs_animation_id, path_animation_id;
let is_animation_running = false;
let start_node_clicked = false, end_node_clicked = false;

function generateGrid(){
    if(is_animation_running)
        return;

    M = Math.floor(window.innerWidth/tile_side);
    N = Math.floor(window.innerHeight*0.85/tile_side);

    start_x = Math.floor(N/2), start_y = Math.floor(M/5), end_x = Math.floor(N/2), end_y = Math.floor(4*M/5);

    let grid = document.getElementById("grid");
    let strHTML = "";
    for(let i = 0; i < N; i++){
        strHTML += "<tr>\n";
        for(let i = 0; i < M; i++){
            strHTML += `\t<td class="element" onmouseenter="onMouseEnter()" onclick="onMouseClick()" onmousedown="onMouseDown()" onmouseleave="onMouseLeave()" onmouseup="onMouseUp()"></td>\n`;
        }   
        strHTML += "</tr>\n";
    }
    grid.innerHTML = strHTML;
    GRID = document.getElementsByTagName("tr"); 
    console.log(GRID);
    GRID[start_x].children[start_y].className = "node-start";
    GRID[end_x].children[end_y].className = "node-end";
}

//on mouse down listener
function onMouseDown() {   
    if(is_animation_running)
        return;
    MOUSEDOWN = true;
    let node = event.currentTarget;
    if(node.classList.contains("node-start"))
        start_node_clicked = true;
    if(node.classList.contains("node-end"))
        end_node_clicked = true;   
}

// on mouse up listener
function onMouseUp() {   
    if(is_animation_running)
        return;
    MOUSEDOWN = false;
    // let node = event.currentTarget;
    // if(node.classList.contains("node-start"))
    //     start_node_clicked = false;
    // if(node.classList.contains("node-end"))
    //     end_node_clicked = false;   
    // if(start_node_clicked)
    start_node_clicked = false;
    // if(start_node_clicked)
    end_node_clicked = false;   
}

//on mouse enter listener
function onMouseEnter(){
    if(is_animation_running)
        return;

    if(is_animation_running)
        return;
    let node = event.currentTarget;
    
    if(start_node_clicked) {
        node.classList.add("node-start");
        node.classList.remove("node-visited", "node-shortest-path");
    }
    else if(end_node_clicked) {
        node.classList.add("node-end");
        node.classList.remove("node-visited", "node-shortest-path");
    }
    else if(MOUSEDOWN){
        node.classList.toggle("node-wall");
    }  
}

//on mouse leave listener
function onMouseLeave(){
    if(is_animation_running)
        return;

    let node = event.currentTarget;
    if(start_node_clicked) {
        node.classList.remove("node-start");
    }
    else if(end_node_clicked) {
        node.classList.remove("node-end");
    }
}

//on mouse click listener
function onMouseClick() {
    if(is_animation_running)
        return;
    let node = event.currentTarget;
    if(node.classList.contains("node-start") || node.classList.contains("node-end"))
        return;

    node.classList.toggle("node-wall");
}


//BFS Algorithm
function findPath(){
    if(is_animation_running)
        return;
    //setting animation runnning to true for disabling clicking and clearing grid on GUI. 
    is_animation_running = true;
      
    //Generating grid for indicating whether node is visited or not. 
    // unvisited node = 0, visited node = 1, wall node = 2
    let grid = [], prevNode = [];
    for(let i = 0; i < N; i++){
        let row = [], nodes = [];
        for(let j = 0; j < M; j++){
            row.push(0);
            nodes.push([-1, -1]);
        }
        grid.push(row);
        prevNode.push(nodes);
    }

    //Initializing grid with start, end and wall nodes and clearing the grid for animation.
    for(let i = 0; i < N; i++){
        for(let j = 0; j < M; j++){
            let classes = GRID[i].children[j].classList;

            classes.remove("node-current", "node-visited", "node-shortest-path");

            if(classes.contains("node-start")){
                start_X = i;
                start_y = j;
            }
            else if(classes.contains("node-end")){
                end_x = i;
                end_y = j;
            }

            if(classes.contains("node-wall")){
                grid[i][j] = 2;
            }
        }
    }
    
    //setting start node as visited
    grid[start_x][start_y] = 1;
    //initializing start previous as [-2, -2] so it can be identified at time of path finding.
    prevNode[start_x][start_y] = [-2, -2];

    //coloring start and end node;
    GRID[start_x].children[start_y].className = "node-start";
    GRID[end_x].children[end_y].className = "node-end";

    BFS(grid, prevNode);
    animateBFS();
    // animatePath();  
}

function BFS(grid, prevNode) {
    let queue = [];
    queue.push([start_x, start_y]);
    
    while(queue.length != 0) {
        let node = queue.shift();
        let i = node[0], j = node[1];
        VISITED_NODES_IN_ORDER.push([i, j]);
        // console.log(node);
        if(i == end_x && j == end_y){
            console.log("Path Found!");
            break;
        }
        if(i+1 < N && grid[i+1][j] == 0){
            queue.push([i+1, j]);
            grid[i+1][j] = 1;
            prevNode[i+1][j] = node;
        }
        if(i-1 >= 0 && grid[i-1][j] == 0){
            queue.push([i-1, j]);
            grid[i-1][j] = 1;
            prevNode[i-1][j] = node;
        }
        if(j+1 < M && grid[i][j+1] == 0){
            queue.push([i, j+1]);
            grid[i][j+1] = 1;
            prevNode[i][j+1] = node;
        }
        if(j-1 >= 0 && grid[i][j-1] == 0){
            queue.push([i, j-1]);
            grid[i][j-1] = 1;
            prevNode[i][j-1] = node;
        }
    }
    VISITED_NODES_IN_ORDER.shift();
    getPathNodesReverse(prevNode);
    console.log("finished");
}


//Animations*******************************************
function getPathNodesReverse(prevNode){
    let i = end_x, j = end_y;
    let t_x, t_y;
    while(i != -2) {
        PATH_NODES_REVERSE.push([i, j]);
        t_x = prevNode[i][j][0];
        t_y = prevNode[i][j][1];
        i = t_x;
        j = t_y;
    }

    //removing start and end nodes.
    PATH_NODES_REVERSE.pop();
    PATH_NODES_REVERSE.shift();
    console.log("path nodes generated!");
}

function animateBFS() {  bfs_animation_id = setInterval(BFSAnimation, 10);} 

function BFSAnimation() {
    if(VISITED_NODES_IN_ORDER.length == 1) {
        let node = VISITED_NODES_IN_ORDER.shift();
        GRID[node[0]].children[node[1]].className = "node-end";
        clearInterval(bfs_animation_id);
        animatePath();
        return;
    }
    let node = VISITED_NODES_IN_ORDER.shift();
    let current = VISITED_NODES_IN_ORDER[0];
    GRID[node[0]].children[node[1]].className = "node-visited";
    GRID[current[0]].children[current[1]].className = "node-current";
}

function animatePath() {  path_animation_id = setInterval(pathAnimation, 50);}

function pathAnimation() {
    if(PATH_NODES_REVERSE.length == 0){
        clearInterval(path_animation_id);
        is_animation_running = false;
        return;
    }
    let node = PATH_NODES_REVERSE.shift();
    GRID[node[0]].children[node[1]].classList.add("node-shortest-path");    
}
