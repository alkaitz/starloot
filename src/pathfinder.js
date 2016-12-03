var graph = undefined;
var radius = undefined;
/**
	Paints the graph
*/
function paintGraph(ctx,nodes) {
	ctx.strokeStyle="#111166";
	ctx.lineWidth=0.1;
	var i=0;
	var j=1;
	while (i < nodes.length-1) {
		ctx.beginPath();
		ctx.lineTo(nodes[i][0],nodes[i][1]);
		ctx.lineTo(nodes[j][0],nodes[j][1]);
		ctx.closePath();
		ctx.stroke();
		j++;
		if (j == nodes.length) {
			i++;
			j = i+1;
		}
	}
	ctx.strokeStyle="#CCCCCC";
	ctx.lineWidth=1;
	for (var i = 0; i < nodes.length; i++) {
		x = nodes[i][0];
		y = nodes[i][1];
		ctx.beginPath();
		ctx.arc(x,y,2,0,Math.PI*2,true);
		ctx.closePath();
		ctx.stroke();
	}
	alert("Graph created");
}

/**
	Euclidean distance between a and b
*/
function segment_length(a,b) {
	var p = a["vertex"];
	var q = b["vertex"];
	return Math.sqrt(Math.pow(p[0]-q[0],2) + Math.pow(2*(p[1]-q[1]),2));
}

/**
	Adds two paths to the graph: a->b and b->a
*/
function addPath(graph,a,b) {
	// a and b are {hash:number, vertex:[x,y]}
	// calculate distance
	var d = segment_length(a,b);
	
	// store a->b
	if (a["hash"] in graph) {
		graph[a["hash"]][b["hash"]] = d;
	} else {
		graph[a["hash"]] = {};
		graph[a["hash"]]["vertex"] = a["vertex"];
		graph[a["hash"]][b["hash"]] = d;
	}
	// store b->a
	if (b["hash"] in graph) {
		graph[b["hash"]][a["hash"]] = d;
	} else {
		graph[b["hash"]] = {};
		graph[b["hash"]]["vertex"] = b["vertex"];
		graph[b["hash"]][a["hash"]] = d;
	}
}

/**
	Add a path all around an obstacle
*/
function addPerimeterPath(graph,nodes,count) {
	for (var i = 0; i < nodes.length-1; i++) {
		addPath(graph,{"hash":count+i,"vertex":nodes[i]},{"hash":count+i+1,"vertex":nodes[i+1]});
	}
	// close the loop
	addPath(graph,{"hash":count+i,"vertex":nodes[i]},{"hash":count,"vertex":nodes[0]});
}

/**
	Check if a path a->b intersects with any obstacle, returns true if path is free
*/
function checkPath(obstacles,a,b,r) {
	var x1 = a[0]; var y1 = a[1];
	var x2 = b[0]; var y2 = b[1];
	// note: intersections with obstacles that contain a or b (with self) are also to be checked
	for (var i=0; i<obstacles.length; i++) {
		var nodes = obstacles[i].getBoundingBox(r);
		for (var j=0; j<nodes.length; j++) {
			var v1 = nodes[j];
			var v2 = nodes[(j+1)%nodes.length];
			var x3 = v1[0]; var y3 = v1[1];
			var x4 = v2[0]; var y4 = v2[1];

			// Idea: http://stackoverflow.com/a/1968345
			var s1_x = x2 - x1; var s1_y = y2 - y1;
			var s2_x = x4 - x3; var s2_y = y4 - y3;

			var s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
			var t = ( s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);
			
			// Coindicing paths are OK (for now)
			if (s > 0 && s < 1 && t > 0 && t < 1) return false;
		}
	}
	return true;
}

/**
	Create a navigation graph for path finding, from a to b, using the given obstacles and radius r
*/
function createGraph(obstacles,r,a,b) {
	// Don't regenerate graph if we have it already
	
	// TODO: This code is disabled because it doesn't do what I want it to do
	if (false && radius != undefined && radius == r) {
		// for each obstacle
		var obs = 0;
		while (obs < obstacles.length) {
			delete graph[obs][-1];
			delete graph[obs][-2];
			obs++;
		}
		// clear previous start and target
		delete graph[-1];
		delete graph[-2];
		
		console.log(graph);
		obs = 0;
		var current_node_count = 0;
		while (obs < obstacles.length) {
			var nodes = obstacles[obs].getBoundingBox(r);
			// add paths to origin and target
			for (var i = 0; i < nodes.length; i++) {
				// and add a connection (if plausible) to a (origin)
				if (checkPath(obstacles,nodes[i],a,r)) {
					addPath(graph,{"hash":current_node_count+i,"vertex":nodes[i]},{"hash":-1,"vertex":a});
				}
				// and add a connection (if plausible) to b (target)
				if (checkPath(obstacles,nodes[i],b,r)) {
					addPath(graph,{"hash":current_node_count+i,"vertex":nodes[i]},{"hash":-2,"vertex":b});
				}
			}
			current_node_count += nodes.length;
			obs++;
		}
		return graph;
	}
	
	graph = {};
	radius = r;
	// for each obstacle, add paths to the other obstacles
	var obs_A = 0;	// current obstacle
	var obs_B;		// another obstacle
	var current_node_count_A = 0;	// this is the node count for all the nodes before obs_A
	var current_node_count_B;		// this is the node count for all the nodes before obs_B
	// for each obstacle A
	while (obs_A < obstacles.length) {
		// TODO: don't add vertices that are inside other obstacles bouding boxes
		// (this happens when buildings are too close, or radius is too big
		
		// get all vertices
		var nodes_A = obstacles[obs_A].getBoundingBox(r);
		// add the perimeter (no intersecting with self paths)
		addPerimeterPath(graph,nodes_A,current_node_count_A);
		
		// add paths to the rest of the obstacles
		if (obs_A < obstacles.length) {
			// get first obstacle after A
			obs_B = obs_A+1;
			current_node_count_B = current_node_count_A + nodes_A.length;
			// add paths to origin and target
			for (var i = 0; i < nodes_A.length; i++) {
				// and add a connection (if plausible) to a (origin)
				if (checkPath(obstacles,nodes_A[i],a,r)) {
					addPath(graph,{"hash":current_node_count_A+i,"vertex":nodes_A[i]},{"hash":-1,"vertex":a});
				}
				// and add a connection (if plausible) to b (target)
				if (checkPath(obstacles,nodes_A[i],b,r)) {
					addPath(graph,{"hash":current_node_count_A+i,"vertex":nodes_A[i]},{"hash":-2,"vertex":b});
				}
			}
			// now add all the following B obstacles
			while (obs_B < obstacles.length) {
				var nodes_B = obstacles[obs_B].getBoundingBox(r);
				// for each vertex in A, add a conexion to each vertex in B
				for (var i = 0; i < nodes_A.length; i++) {
					for (var j = 0; j < nodes_B.length; j++) {
						// check if path intersects something, if not, add it
						if (checkPath(obstacles,nodes_A[i],nodes_B[j],r)) {
							addPath(graph,{"hash":current_node_count_A+i,"vertex":nodes_A[i]},{"hash":current_node_count_B+j,"vertex":nodes_B[j]});
						}
					}
				}
				current_node_count_B += nodes_B.length;
				obs_B++;
			}
		}
		current_node_count_A += nodes_A.length;
		obs_A++;

	}

	// Paint graph
	/*
	ctx.strokeStyle = "#111166";
	ctx.lineWidth = 0.2;
	for (var key1 in graph) {
		var node1 = graph[key1];
		for (var key2 in node1) {
			var node2 = graph[key2];
			if (key2!="vertex") {
				ctx.beginPath();
				ctx.moveTo(node1["vertex"][0],node1["vertex"][1]);
				ctx.lineTo(node2["vertex"][0],node2["vertex"][1]);
				ctx.closePath();
				ctx.stroke();
			}
		}		
	}
	alert("toma");
*/
	return graph;
}

/**
	Heuristic function for A*
	My guess that a straight line was a good heuristic was good! :)
	http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
*/
function heuristic(a,b) {
	return segment_length(a,b);
}

/**
	Get next node for A* (the one with the lowest heuristic value)
*/
function getClosestCandidate(candidates,h_dist) {
	var lowest_dist = undefined;
	var result;
	for (var node in h_dist) {
		if (node in candidates && (lowest_dist == undefined || h_dist[node] < lowest_dist)) {
			lowest_dist = h_dist[node];
			result = node;
		}
	}
	return result;
}

/**
	Retrieves node path from A* results
*/
function reconstruct_path(came_from, current_node) {
	if (current_node in came_from) {
		var r = reconstruct_path(came_from, came_from[current_node])
		r[r.length] = current_node;
		return r;
	}
	return [current_node];
}

/**
	Generate a path of {x,y} vertices
*/
function make_vertex_path(graph,came_from) {
	var r = reconstruct_path(came_from, -2);
	var result = new Array(r.length);
	for (var i=1; i<r.length; i++) {
		var node = graph[r[i]]["vertex"];
		result[i] = {'x':node[0],'y':node[1]};
	}
	return result;
}

/**
	Sometimes returns a list of {x,y} containing the shortest path from a to b, using A*
	r: unit radius
	obstacles: list of things to avoid
*/
function findPath(a,b,obstacles,r) {
	// if there are no obstacles, just return the target
	if (checkPath(obstacles,a,b,r)) {
		var result = new Array(1);
		result[0] = [{'x':b[0],'y':b[1]}];
		return [{'x':b[0],'y':b[1]}];
	}
	// create graph for path finding
	var time_a = (new Date).getTime();
	var graph = createGraph(obstacles,r,a,b);
	var time_b = (new Date).getTime();
	console.log("Graph generation took " + (time_b - time_a) + " ms.");
	// start and target nodes are always tagged as -1 and -2 respectively
	
	// A* algorithm
	var evaluated = {};			// Already evaluated nodes (empty)
	var candidates = {};		// Candidates...
	candidates[-1] = 0;			// ...with start node
	var candidates_length = 1;
	var came_from = {};			// Navigated nodes (empty)
	
	var dist = {};				// Optimal distances from start
	dist[-1] = 0;				// (distance from start to start is 0)
	var h_dist = {};			// Heuristic distances to goal
	h_dist[-1] = heuristic(graph[-1],graph[-2]);

	while (candidates_length > 0) {
		var current = getClosestCandidate(candidates,h_dist);
		if (current == -2) {	// Goal reached
			time_a = (new Date).getTime();
			console.log("A* took " + (time_a - time_b) + " ms.");
			return make_vertex_path(graph,came_from);
		}		
		delete candidates[current];		// Remove current from candidates...
		candidates_length--;
		evaluated[current] = 0;			// ...and add to evaluated nodes (I assign 0 so I can add it)
		for (var neighbor in graph[current]) {
			// evaluate all *new* neighbors (ignore "vertex" key)
			if (neighbor != "vertex" && !(neighbor in evaluated)) {
				var d = dist[current] + segment_length(graph[current],graph[neighbor]);
				// if distance to neighbor improves through current
				if (!(neighbor in candidates) || d < dist[neighbor]) {
					candidates[neighbor] = 0; candidates_length++; // add node to candidates
					came_from[neighbor] = current;	// update map
					dist[neighbor] = d;				// update distance to neighbour
					h_dist[neighbor] = d + heuristic(graph[neighbor],graph[-2]); // update heuristic distance to goal
				}
			}
		}
	}
	//console.log(evaluated);
    console.log("Shit, path not found");
}