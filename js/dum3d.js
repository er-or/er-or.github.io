// NOTE: SORT Z DOES NOT SEEM TO BE WORKING

//
// BIG TO DO!!!
//
// NEED TO IMPLEMENT PHONG SHADING
// NEED TO IMPLEMENT CAMERA (SCOPE) POSITION AND ORIENTATION VECTORS
//

//
//
// Dum3D.js
//
//
//
//
//   By: Joshua Shuller
//   On: August 7, 2012
//
//
// This javascript file contains a minimal 3D library for rendering
// 3D objects on a 2D HTML5 canvas objects.
//
// There are 8 javascript classes defined:
//  1) DumTorch - a light source for calculating reflectivity of surfaces.
//  2) DumStage - a group of 3D shapes that are shown, kind of like a region in space.
//  3) DumScope - an imaginary window that we view the 3D shapes through on the computer screen.
//  5) DumGroup - a group of DumShapes
//  4) DumShape - a 3D shape = collection of facets (polygons).
//  5) DumFacet - a polygon.
//  6) DumColor - RGBA color.
//  7) DumPoint - a 3D point (vertex) for defining polygons with.
//
//
// Additionally, there is an example function:
//    Dum3dExample(canvas_id)
// which draws a 3D cube onto the canvas of the specified DOM id.
//
//
//
//
//


var dum_stage = null;
var dum_scope = null;
var dum_thing = null;

var dum_rot_x = 0.0;
var dum_rot_y = 0.0;
var dum_rot_z = 0.0;


function Dum3dExample(canvas_id) {

    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext('2d');


    if (!dum_stage) {
        dum_stage = new DumStage();
    }
    if (!dum_scope) {
        dum_scope = new DumScope(dum_stage);
    }
    dum_scope.screen_w = canvas.width;
    dum_scope.screen_h = canvas.height;
    if (!dum_thing) {
        var dum_cad = document.getElementById('cad');
        if (dum_cad) {
            dum_cad = dum_cad.value;
        }
        if (dum_cad && dum_cad.length && dum_cad.length > 100) {
            dum_thing = DumStage.shapeFromCAD(dum_cad);
            dum_thing.move(200, 200, 100);
        } else {
            dum_thing = Dum3dCube();
        }
        dum_stage.include(dum_thing);
    }
    dum_scope.paint(ctx);


    dum_thing.rotX(dum_rot_x);
    dum_thing.rotY(dum_rot_y);
    dum_thing.rotZ(dum_rot_z);

    setTimeout('Dum3dExample("' + canvas_id + '")', 50);

}





//
//
//    p1----------p4
//    | \          |\
//    |  \         | \
//    |   p8-------|-p5
//    |   |        |  |
//    p2----------p3  |
//      \ |         \ |
//       \|          \|
//        p7---------p6
//
//
function Dum3dCube(s) {

	let p1 = new DumPoint(100,  100,  1200);
	let p2 = new DumPoint(100,  500,  1200);
	let p3 = new DumPoint(500,  500,  1200);
	let p4 = new DumPoint(500,  100,  1200);

	let p5 = new DumPoint(500,  100,  1600);
	let p6 = new DumPoint(500,  500,  1600);
	let p7 = new DumPoint(100,  500,  1600);
	let p8 = new DumPoint(100,  100,  1600);

	let a1 = new Array();
	a1[0] = p1;
	a1[1] = p2;
	a1[2] = p3;
	a1[3] = p4;
	let s1 = new DumFacet(a1, 4, new DumColor(0, 255, 255, 0.75));

	let a2 = new Array();//[p2, p3, p6, p7]
	a2[0] = p2;
	a2[1] = p3;
	a2[2] = p6;
	a2[3] = p7;
	let s2 = new DumFacet(a2, 4, new DumColor(255, 255, 0, 0.75));

	let s3 = new DumFacet([p5, p6, p7, p8], 4, new DumColor(255, 0, 0, 0.75));
	let s4 = new DumFacet([p1, p4, p5, p8], 4, new DumColor(0, 255, 0, 0.75));
	let s5 = new DumFacet([p1, p2, p7, p8], 4, new DumColor(0, 0, 255, 0.75));
	let s6 = new DumFacet([p3, p4, p5, p6], 4, new DumColor(255, 0, 255, 0.75));


	let q = new DumShape([s1, s2, s3, s4, s5, s6], 6);

	q.move(0, 0, 1000);

	//var ta = document.getElementById('ta');
	//setInnerHtml(ta, JSAN.var_dump(q));
	return q;

}





function Dum3dCylinder(x, y, z, r, h, top_color, side_color, bottom_color, vert_count) {

    if (!vert_count || vert_count <= 0) {
        vert_count = 10;
    }

    if (!top_color) {
        top_color = new DumColor(128, 128, 128, 0);
    }
    if (!side_color) {
        side_color = top_color;
    }
    if (!bottom_color) {
        bottom_color = side_color;
    }

    var top_ps = null;
    var bottom_ps = null;
    var sides = null;
    var top_s = null;
    var bottom = null;
    var shape = null;

    try {

        top_ps = new Array();
        bottom_ps = new Array();
        sides = new Array();

        for (var i = 0; i < vert_count; i++) {
            top_ps[i] = new DumPoint(
                x + r * Math.cos(i * 2*Math.PI / vert_count),
                y + r * Math.sin(i * 2*Math.PI / vert_count),
                z + h / 2
            );
            bottom_ps[i] = new DumPoint(
                x + r * Math.cos(i * 2*Math.PI / vert_count),
                y + r * Math.sin(i * 2*Math.PI / vert_count),
                z - h / 2
            );
            if (i > 0) {
                sides[i - 1] = new DumFacet([top_ps[i], top_ps[i-1], bottom_ps[i-1], bottom_ps[i]], 4, side_color);
            }
        }
        sides[sides.length] = new DumFacet([top_ps[0], top_ps[vert_count-1], bottom_ps[vert_count-1], bottom_ps[0]], 4, side_color);
        top_s = new DumFacet(top_ps, top_ps.length, top_color);
        bottom = new DumFacet(bottom_ps, bottom_ps.length, bottom_color);
        sides[sides.length] = top_s;
        sides[sides.length] = bottom;

        shape = new DumShape(sides, sides.length);

        return shape;

    } finally {
        top_ps = null;
        bottom_ps = null;
        top_s = null;
        bottom = null;
        sides = null;
        shape = null;
    }
}






//
//
//
//
// LIGHT SOURCE
//
// Shows the direction of the light as a unit vector
//
//
//
//
function DumTorch(x, y, z) {

    //
    // Ambiant background color brightnesses
    //
    this.bacR = 0.6;
    this.bacG = 0.6;
    this.bacB = 0.6;

    //
    // Point light color brightnesses
    //
    this.brtR = 1.0;
    this.brtG = 1.0;
    this.brtB = 1.0;

    //
    // Direction of point light (unit vector)
    //
    this.x = 0;
    this.y = 0;
    this.z = 1;
    this.setDirection(x, y, z);

}


DumTorch.prototype.setDirection = function(x, y, z) {
    var m = 0;
    try {
        if (isNaN(x) || !x) { x = 0; }
        if (isNaN(y) || !y) { y = 0; }
        if (isNaN(z) || !z) { z = 0; }
        m = Math.sqrt(x * x + y * y + z * z);
        this.x = x / m;
        this.y = y / m;
        this.z = z / m;
    } finally {
        m = null;
    }
};










//
//
//
//
// STAGE
//
// A shape is on a particular stage at a particular time
// whether the scope is currently viewing that stage or
// not is up to the application
//
//
//
function DumStage() {

    this.shapes = new Array();
    this.length = 0;

    // LIGHTS
    this.lights = new DumTorch(1,1,1);
    this.liglen = 0;

}


DumStage.prototype.include = function(n) {
    if (!n) {
        return;
    }
    if (n instanceof DumGroup) {
        for (var i = 0; i < n.length; i++) {
            if (n.shapes[i].include_id) {
                continue;
            }
            n.shapes[i].include_id = this.length + 1;
            this.shapes[this.length++] = n.shapes[i];
        }
    } else if (n instanceof DumShape) {
        if (n.include_id) {
            return;
        }
        n.include_id = this.length + 1;
        this.shapes[this.length++] = n;
    }
}




DumStage.prototype.sortZ = function(from_scope) {

    var temp = null;
    var i = null;
    var end = null;
    var got = null;
    try {

        //
        // Set distance to scope
        //
        if (from_scope) {
            // Distance from scope
            for (i = 0; i < this.length; i++) {
                this.shapes[i].scopez = Math.sqrt(
                    (this.shapes[i].cx - from_scope.scope_cx) * (this.shapes[i].cx - from_scope.scope_cx)
                  + (this.shapes[i].cy - from_scope.scope_cy) * (this.shapes[i].cy - from_scope.scope_cy)
                  + (this.shapes[i].cz - from_scope.scope_cz) * (this.shapes[i].cz - from_scope.scope_cz)
                );
                this.shapes[i].sortZ(from_scope);
            }
        } else {
            // Distance from origin
            for (i = 0; i < this.length; i++) {
                this.shapes[i].scopez = this.shapes[i].cz;
                this.shapes[i].sortZ();
            }
        }


        //
        // Bubble trouble
        //
        end = this.length - 1;
        got = true;
        while (end > 0 && got) {
            got = false;
            for (i = 0; i < end; i++) {
                if (this.shapes[i].scopez < this.shapes[i + 1].scopez) {
                    temp = this.shapes[i];
                    this.shapes[i] = this.shapes[i + 1];
                    this.shapes[i + 1] = temp;
                    got = true;
                }
            }
            end--;
        }

    } finally {
        temp = null;
        i = null;
        end = null;
        got = null;
    }
};




//
//
//
// 0 31 8 0 ''
// 0 591 ZKONST 1 BCOD 856 ABXY 0.100 ABZ 0.100
// 0 528 0 226
// 0 591 ZKONST -10.700
// 0 530 1
// 0 501 12.869 0.000 -10.693
// 0 531
// 0 591 ZKONST -10.300
// 0 530 2
// 0 501 16.405 1.131 -10.237
// 0 501 13.294 0.000 -10.256
// 0 531
// 0 591 ZKONST -10.200
// 0 530 6
// 0 501 17.607 1.626 -10.124
// 0 501 17.041 1.485 -10.156
// 0 501 13.647 0.212 -10.166
// 0 501 13.435 0.000 -10.128
// 0 501 13.506 0.071 -10.143
// 0 501 13.576 0.141 -10.153
// 0 531
// 0 591 ZKONST -10.100
// 0 530 3
// 0 501 17.112 1.414 -10.029
// 0 501 16.829 1.273 -10.003
// 0 501 13.647 0.071 -10.019
// 0 531
//
DumStage.shapeFromCAD = function(cad_str) {

    var parts = null;
    var count = 0;
    var point = null;
    var facet = null;
    var shape = null;

    try {

        shape = new DumShape();
        parts = new Array();

        for (var i = 0; i < cad_str.length; i++) {
            if (cad_str.charAt(i) > ' ') {
                if (i == 0 || cad_str.charAt(i - 1) == "\r" || cad_str.charAt(i - 1) == "\n") {
                    // AT LINE BEGINNING...
                    count = 0;
                    while (i < cad_str.length) {
                        parts[count] = '';
                        while (i < cad_str.length && cad_str.charAt(i) <= ' ') {
                            i++;
                        }
                        while (i < cad_str.length && cad_str.charAt(i) > ' ') {
                            parts[count] += cad_str.charAt(i);
                            i++;
                        }
                        count++;
                        while (i < cad_str.length && cad_str.charAt(i) <= ' ') {
                            if (cad_str.charAt(i) == "\r" || cad_str.charAt(i) == "\n") {
                                 break;
                            }
                            i++;
                        }
                        if (cad_str.charAt(i) == "\r" || cad_str.charAt(i) == "\n") {
                            break;
                        }
                    }


                    if (count > 4 && parts[1] == '501') {
                        point = new DumPoint(parseFloat(parts[2]), parseFloat(parts[3]), parseFloat(parts[4]));
                        if (facet == null) {
                            facet = new DumFacet();
                            facet.r = 0;
                            facet.g = 0;
                            facet.b = 0;
                            facet.a = 0.5;
                            facet.dots = 1;
                        }
                        //if (i > 100) {
                        //    break;
                        //}
                    } else if (count > 1 && parts[1] == '531') {

                        if (facet && facet.length > 0) {
                            shape.addFacet(facet);
                            facet = null;
                        }
                    } else if (count > 1 && parts[1] == '530') {
                        // begin facet
                        if (facet) {

                            shape.addFacet(facet);
                            facet = new DumFacet();

                            facet.r = 0;
                            facet.g = 0;
                            facet.b = 0;
                            facet.a = 0.5;
                            //facet.line = 'none';
                            facet.dots = 1;

                        }
                    }

                }
            }
        }
        if (facet && facet.length) {
            shape.addFacet(facet);
            shape.computeVertexNormals();
            alert(facet.length);
        }
        return shape;
    } finally {
        parts = null;
        count = 0;
        point = null;
        facet = null;
        shape = null;
    }
}













//
//
//
// DUM SCOPE
//
// The viewing window that we are looking at our 3-d stage through
// this does the basic 3-d transforms manually
//
// Renders the position of the polygons on the screen
// according to the position of the scope (canvas)
// relative to the users eyes in x, y, and z.
//
//
function DumScope(stage) {

	this.stage = stage;

	// POSITION OF CAMERA ON STAGE
	this.scope_cz = 250;  // DISTANCE FROM SCREEN IN PIXELS
	this.scope_cx = 250;  // CENTER X OF THE CANVAS
	this.scope_cy = 250;  // CENTER Y OF THE CANVAS

	this.screen_w = 500;
	this.screen_h = 500;

	this.fov = Math.PI / 6;    // FIELD OF VIEW

	this.got_rendered = false; // FLAG USED TO SAY IF WE ARE KEEPING TRACK OF MIN/MAX RENDERED X AND Y YET
	this.max_rendered_x = 0;
	this.max_rendered_y = 0;
	this.min_rendered_x = 0;
	this.min_rendered_y = 0;

	this.draw_outlines = false;
}



DumScope.prototype.paint = function(ctx) {

	this.screen_w = ctx.canvas.width;
	this.screen_h = ctx.canvas.height;

	let lights = null;

	let shapes = null;
	let facets = null;
	let points = null;

	let xs = null;
	let ys = null;

	let px = null;
	let py = null;

	let r = null;
	let d = null;
	let ax = null;
	let ay = null;

	let screen_fx = null;
	let screen_fy = null;

	let fill = null;
	let draw = null;

	let in_fov = null;

	this.got_rendered = false;

	screen_fx = Math.min(this.screen_w, this.screen_h) / Math.sin(this.fov);
	screen_fy = screen_fx;

	this.stage.sortZ(this);
	lights = this.stage.lights;
	shapes = this.stage.shapes;

	//
	// CHECK IF IT NEEDS A REPAINT
	//
	for (let i = 0; i < this.stage.length; i++) {
		facets = shapes[i].facets;
		for (let j = 0; j < shapes[i].length; j++) {
			if (facets[j].scopez > 0) {
				if (facets[j].invalid) {
					// NEEDS REPAINT IF IN FOV
					in_fov = false;
					points = facets[j].points;
					for (let k = 0; k < facets[j].length; k++) {
						//px = this.scope_cz*(points[k].x-this.scope_cx)/points[k].z + this.scope_cx;
						//py = this.scope_cz*(points[k].y-this.scope_cy)/points[k].z + this.scope_cy;
						r = Math.sqrt((this.scope_cz - points[k].z) * (this.scope_cz - points[k].z) + (this.scope_cy - points[k].y) * (this.scope_cy - points[k].y) + (this.scope_cy - points[k].y) * (this.scope_cx - points[k].x));
						d = Math.sqrt(points[k].x * points[k].x + points[k].y * points[k].y);
						ax = Math.acos((points[k].x - this.scope_cx) / r);
						ay = Math.asin((points[k].y - this.scope_cy) / r);
						px = this.scope_cx + Math.cos(ax) * screen_fx;
						py = this.scope_cy + Math.sin(ay) * screen_fy;
						facets[j].bxs[k] = px;
						facets[j].bys[k] = py;

						//setInnerHtml(document.getElementById('dbgout'), '(' + ax + ', ' + ay + ')');
						//if (Math.abs(ax) <= this.fov && Math.abs(ay) <= this.fov) {
						if (px >= 0 && py >= 0 && px <= this.screen_w && py <= this.screen_h) {
							in_fov = true;
						}

					}

					facets[j].revalidate();
					facets[j].in_fov = in_fov;
					if (in_fov) {
						this.got_rendered = true;
					}
				}
			}
		}
	}





	//
	// Render if in FOV
	//
	if (this.got_rendered) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		for (let i = 0; i < this.stage.length; i++) {
			facets = this.stage.shapes[i].facets;
			for (let j = 0; j < shapes[i].length; j++) {
				if (facets[j].scopez > 0 && facets[j].in_fov) {

					// now we can use the buffered polygon
					xs = facets[j].bxs;
					ys = facets[j].bys;

					//lineWidth = value
					//lineCap = type
					//lineJoin = type
					//miterLimit = value
					//if (facets[j].lineWidth) {
					//} else if (shapes[i].lineWidth) {
					//} else {
					//}

					if (!facets[j].dots || facets[j].dots <= 0) {

						//
						// Draw the polygon
						//

						// Color
						facets[j].illuminate(lights);

						if (facets[j].fill) {
							fill = facets[j].fill;
						} else if (shapes[i].fill) {
							fill = shapes[i].fill;
						} else {
							fill = null;
						}

						if (facets[j].draw) {
							draw = facets[j].draw;
						} else if (shapes[i].draw) {
							draw = shapes[i].draw;
						} else {
							draw = null;
						}

						ctx.beginPath();
						ctx.moveTo(xs[0], ys[0]);
						for (let k = 1; k < facets[j].length; k++) {
							ctx.lineTo(xs[k], ys[k]);
						}
						//ctx.lineTo(xs[0], ys[0]);
						ctx.closePath();

						if (fill) {
							ctx.fillStyle = fill;
							ctx.fill();
						}
						if (this.draw_outlines && draw) {
							ctx.lineWidth = 0.5;
							ctx.strokeStyle = draw;
							ctx.stroke();
						}


					} else {
						// Dots only???
						for (let k=0; k < facets[j].length; k++) {
							ctx.fillStyle = facets[j].points[k].illuminate(shapes[i], lights);
							ctx.fillRect(xs[k], ys[k], facets[j].dots, facets[j].dots);
						}
					}
				}
			}
		}
	}


};















//
//
// COLOR
//
// Stores rgba color info
// red is 0-255
// blue is 0-255
// green is 0-255
// alpha is 0.0-1.0
//
//
function DumColor(r, g, b, a) {
    if (isNaN(r)) {
        r = 0;
    }
    if (isNaN(g)) {
        g = 0;
    }
    if (isNaN(b)) {
        b = 0;
    }
    if (isNaN(a)) {
        a = 1.0;
    }
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

DumColor.prototype.setRGBA = function(r, g, b, a) {
    if (isNaN(r)) {
        r = 0;
    }
    if (isNaN(g)) {
        g = 0;
    }
    if (isNaN(b)) {
        b = 0;
    }
    if (isNaN(a)) {
        a = 1.0;
    }
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}






//
//
// A 3-D POINT, OR VECTOR, IN SPACE
//
//
function DumPoint(x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;

    this.normal = null;  // NORMAL VERTEX DumPoint, IF APPLICABLE

    this.moved = false;  // FLAG TO TELL IF THIS POINT HAS BEEN ROTATED OR SCALED OR WHATEVER YET

}

DumPoint.oppositeNormal = function(x, y, z) {
    var p = null;
    try {
        p = new DumPoint(-x, -y, -z);
        p.toUnitVector();
        return p;
    } finally {
        p = null;
    }
}


DumPoint.prototype.illuminate = function(shape, light) {

    var shine = 1;

    try {

        if (light && this.normal) {

            // NEED TO IMPLEMENT PHONG SHADING
            //shine = (
            //    (
            //        (light.x*this.normal.x + light.y*this.normal.y + light.z*this.normal.z)
            //      / Math.sqrt(this.normal.x*this.normal.x + this.normal.y*this.normal.y + this.normal.z*this.normal.z)
            //    )
            //  + 1
            //) / 2.0
            //;
            if (isNaN(shine)) {
                shine = 1;
            }
            // color = shine*brightness*(color*(1-background) + (255-color)*ref) + color*background
            return 'rgba('
              + parseInt(shine*light.brtR*(shape.r*(1-light.bacR) + (255-shape.r)*shape.ref) + shape.r*light.bacR) + ','
              + parseInt(shine*light.brtG*(shape.g*(1-light.bacG) + (255-shape.g)*shape.ref) + shape.g*light.bacG) + ','
              + parseInt(shine*light.brtB*(shape.b*(1-light.bacB) + (255-shape.b)*shape.ref) + shape.b*light.bacB) + ','
              + shape.a
              + ');'
            ;
        } else {
            return 'rgba(' + shape.r + ',' + shape.g + ',' + shape.b + ',' + shape.a + ');';
        }
    } finally {
        shine = null;
    }
}

DumPoint.prototype.toUnitVector = function() {
    var m = null;
    try {
        m = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x = this.x / m;
        this.y = this.y / m;
        this.z = this.z / m;
    } finally {
        m = null;
    }
}





//
//
// A POLYGON, OR SURFACE, MADE OF POINTS
//
//
function DumFacet(pts, len, clr) {

    //
    // CENTER POINT
    //
    this.cx = 0;
    this.cy = 0;
    this.cz = 0;


    // DISTANCE FROM SCOPE
    this.scopez = 0;

    // IN FIELD OF VIEW
    this.in_fov = false;

    // OUTWARD DIRECTION VECTOR
    this.direct = new DumPoint(0, 0, 0);

    // NORMAL VECTOR
    this.normal = new DumPoint(0, 0, 0);

    // POLYGON POINTS
    if (len > 0) {
        this.length = len;
    } else if (pts && pts.length) {
        this.length = pts.length;
    } else {
        this.length = 0;
    }
    this.points = new Array();
    for (var i = 0; i < this.length; i++) {
        if (!pts[i]) {
            this.length = i;
            break;
        }
        this.cx += pts[i].x;
        this.cy += pts[i].y;
        this.cz += pts[i].z;
        this.points[i] = pts[i];
    }
    this.cx /= this.length;
    this.cy /= this.length;
    this.cz /= this.length;


    // COLOR
    if (clr) {
        this.r = clr.r;
        this.g = clr.g;
        this.b = clr.b;
        this.a = clr.a;
    } else {
        this.r = 127;
        this.g = 127;
        this.b = 127;
        this.a = 1;
    }
    this.color = new DumColor(this.r, this.g, this.b, this.a);

    // REFLECTIVITY
    this.ref = 0.5;

    //
    // INITIALLY INVALIDATED 2-D BUFFER
    //
    this.invalid = true;
    this.bxs = new Array();
    this.bys = new Array();

    this.fill = null;
    this.draw = null;
    this.dots = false;  // WHETHER TO ONLY DRAW VERTICES OR NOT (FALSE = ENTIRE POLYGONS)

}


DumFacet.prototype.addPoint = function(pnt) {

    if (!pnt) {
        return;
    }

    if (this.length) {
        this.cx *= this.length;
        this.cy *= this.length;
        this.cz *= this.length;
    } else {
        this.cx = 0;
        this.cy = 0;
        this.cz = 0;
    }

    this.points[this.length++] = pnt;
    this.cx += pnt.x;
    this.cy += pnt.y;
    this.cz += pnt.z;


    this.cx /= this.length;
    this.cy /= this.length;
    this.cz /= this.length;

}




DumFacet.prototype.copy = function(pts, len) {

    try {
        if (len > 0) {
            this.length = len;
        } else {
            this.length = 0;
        }
        this.points = new Array();

        for (var i = 0; i < this.length; i++) {
            this.points[i] = pts[i].copy;
        }

    } finally {
    }
}



DumFacet.prototype.clone = function() {
    var nfacet = null;
    try {
        nfacet = new DumFacet(this.points, this.length);
        return nfacet;
    } finally {
        nfacet = null;
    }
}



//
// IF ANY POINTS ARE IN THE SAME POSITION AS ANY OF THE POINTS IN THE OTHER FACET,
// THE POINT IN THIS FACET IS DELETED AND THE REFERENCE IN THE ARRAY IS CHANGED TO
// THAT OF THE OTHER FACET
//
DumFacet.prototype.mergePoints = function(fac) {
    try {
        for (var i = 0; i < this.length; i++) {
            for (var j = 0; j < fac.length; j++) {
                if (this.points[i].x == fac.points[j].x && this.points[i].y == fac.points[j].y && this.points[i].z == fac.points[j].z) {
                    // SAME POINT IN SPACE
                    delete this.points[i];
                    this.points[i] = fac.points[j];
                }
            }
        }
    } finally {
    }
}



//
// MARKS THIS FACET AS HAVING BEEN CHANGED SO ITS BUFFER AND COLOR CAN BE RECOMPUTED
//
DumFacet.prototype.invalidate = function() {
    this.invalid = true;
}

DumFacet.prototype.revalidate = function() {
    this.invalid = false;
}


//
// SMACK DOWN POWER
// WEAPON OF DESTRUCTION
//
DumFacet.prototype.illuminate = function(light) {
    var shine = 1;
    try {
        //
        // NEED TO USE PHONG REFLECTION
        //shine = (
        //    (
        //        (light.x*this.normal.x + light.y*this.normal.y + light.z*this.normal.z)
        //      / Math.sqrt(this.normal.x*this.normal.x + this.normal.y*this.normal.y + this.normal.z*this.normal.z)
        //    )
        //  + 1
        //) / 2.0
        //;
        if (isNaN(shine)) {
            shine = 1;
        }
        // color = shine*brightness*(color*(1-background) + (255-color)*ref) + color*background
        this.color.setRGBA(
            Math.round(shine*light.brtR*(this.r*(1-light.bacR) + (255-this.r)*this.ref) + this.r*light.bacR),
            Math.round(shine*light.brtG*(this.g*(1-light.bacG) + (255-this.g)*this.ref) + this.g*light.bacG),
            Math.round(shine*light.brtB*(this.b*(1-light.bacB) + (255-this.b)*this.ref) + this.b*light.bacB),
            this.a
        );
        this.fill = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.color.a + ')';
        this.draw = 'rgba(0,0,0,0.5)';
    } finally {
        shine = null;
    }
}











//
//
// SHAPE
//
// A GROUP OF FACETS.  A POLYHEDRON CONSISTING OF ONE OR MORE POLYGONS.
// ROTATIONS AND TRANSFORMS ARE DONE HERE.
//
function DumShape(fcts, len) {



    //
    // INITIALIZE FACETS ARRAY
    //
    this.facets = new Array();
    this.length = 0;

    if (!len || len < 0) {
        if (fcts && fcts.length) {
            this.length = fcts.length;
        } else {
            this.length = 0;
        }
    } else {
        this.length = len;
    }

    this.cx = 0;
    this.cy = 0;
    this.cz = 0;


    this.scopez = 0; // DISTANCE FROM SCOPE FOR Z-SORTING


    for (var i = 0; i < this.length; i++) {
        this.facets[i] = fcts[i];
        this.cx += fcts[i].cx;
        this.cy += fcts[i].cy;
        this.cz += fcts[i].cz;
    }
    this.cx /= this.length;
    this.cy /= this.length;
    this.cz /= this.length;

    for (var i = 0; i < this.length; i++) {

        this.facets[i].normal.x = this.facets[i].cx - this.cx;
        this.facets[i].normal.y = this.facets[i].cy - this.cy;
        this.facets[i].normal.z = this.facets[i].cz - this.cz;
        this.facets[i].normal.toUnitVector();

        this.facets[i].direct.x = this.facets[i].cx - this.cx;
        this.facets[i].direct.y = this.facets[i].cy - this.cy;
        this.facets[i].direct.z = this.facets[i].cz - this.cz;
    }

}



DumShape.prototype.addFacet = function(fct) {

    if (fct == null) {
        return;
    }


    if (this.length) {
        this.cx *= this.length;
        this.cy *= this.length;
        this.cz *= this.length;
    } else {
        this.cx = 0;
        this.cy = 0;
        this.cz = 0;
    }

    this.facets[this.length++] = fct;
    this.cx += fct.cx;
    this.cy += fct.cy;
    this.cz += fct.cz;


    this.cx /= this.length;
    this.cy /= this.length;
    this.cz /= this.length;


}


DumShape.prototype.attachClone = function(fct) {
    if (fct == null) return;
    this.facets[this.length++] = fct.clone();
}

DumShape.prototype.attach = function(fct) {
    if (fct == null) return;
    this.facets[this.length++] = fct;
}


// NEED TO MOVE THIS FUNCTION TO DUM STAGE

DumShape.prototype.sortZ = function(from_scope) {

    var temp = null;
    var end = null;
    var got = null;
    var j = null;

    try {


        //
        // SET DISTANCE TO SCOPE
        //
        if (from_scope) {
            // DISTANCE FROM SCOPE
            for (var i = 0; i < this.length; i++) {
                this.facets[i].scopez = Math.sqrt(
                    (this.facets[i].cx - from_scope.scope_cx) * (this.facets[i].cx - from_scope.scope_cx)
                  + (this.facets[i].cy - from_scope.scope_cy) * (this.facets[i].cy - from_scope.scope_cy)
                  + (this.facets[i].cz - from_scope.scope_cz) * (this.facets[i].cz - from_scope.scope_cz)
                );
                if (this.facets[i].cz <= from_scope.scope_cz) {
                    this.facets[i].cz = -this.facets[i].cz;
                }
            }
        } else {
            // DISTANCE FROM ORIGIN
            for (var i = 0; i < this.length; i++) {
                this.facets[i].scopez = this.facets[i].cz;
            }
        }



        var top = this.length - 1;
        var got = true;
        while (top > 0 && got) {
            got = false;
            for (var i = 0; i < top; i++) {
                //if (!this.facets[i] || !this.facets[i].scopez) {
                //    alert('foo: ' + this.facets[i].length);
                //}
                if (this.facets[i].scopez <= this.facets[i + 1].scopez) {
                    temp = this.facets[i];
                    this.facets[i] = this.facets[i + 1];
                    this.facets[i + 1] = temp;
                    got = true;
                }
            }
            top--;
        }


    } finally {
        temp = null;
        end = null;
        got = null;
        j = null;
    }
}


DumShape.prototype.avgX = function() {
    var x = 0;
    try {
        for (var i=0;i<this.length;i++) {
            x += this.facets[i].cx;
        }
        return x/this.length;
    } finally {
        x = null;
    }
}

DumShape.prototype.avgY = function() {
    var y = 0;
    try {
        for (var i = 0; i<this.length; i++) {
            y += this.facets[i].cy;
        }
        return y/this.length;
    } finally {
        y = null;
    }
}


DumShape.prototype.avgZ = function() {
    var z = 0;
    try {
        for (var i=0;i<this.length;i++) {
            z += this.facets[i].cz;
        }
        return z/this.length;
    } finally {
        z = null;
    }
}




DumShape.prototype.rotX = function(theta, y, z) {

    if (isNaN(z)) {
        z = this.cz;
    }
    if (isNaN(y)) {
        y = this.cy;
    }

    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    var offY = this.cy - y;
    var offZ = this.cz - z;
    this.cy = y + offY*cos - offZ*sin;
    this.cz = z + offY*sin + offZ*cos;

    var vts = null;

    try {


        //
        // MARK ALL FACETS AS NOT ROTATED
        //
        for (var i = 0; i < this.length; i++) {
            vts = this.facets[i].points;
            for (var j=0; j < this.facets[i].length; j++) {
                vts[j].moved = false;
            }
        }

        //
        // ROTATE ALL FACETS
        //
        for (var i = 0; i < this.length; i++) {

            vts = this.facets[i].points;

            for (var j=0; j < this.facets[i].length; j++) {
                if (!vts[j].moved) {
                    offY = vts[j].y - y;
                    offZ = vts[j].z - z;
                    vts[j].y = y + offY*cos - offZ*sin;
                    vts[j].z = z + offY*sin + offZ*cos;
                    vts[j].moved = true;
                }
            }

            offY = this.facets[i].cy - y;
            offZ = this.facets[i].cz - z;
            this.facets[i].cy = (y + offY*cos - offZ*sin);
            this.facets[i].cz = (z + offY*sin + offZ*cos);

            offY = this.facets[i].direct.y;
            offZ = this.facets[i].direct.z;
            this.facets[i].direct.y = (offY*cos - offZ*sin);
            this.facets[i].direct.z = (offY*sin + offZ*cos);

            offY = this.facets[i].normal.y;
            offZ = this.facets[i].normal.z;
            this.facets[i].normal.y = (offY*cos - offZ*sin);
            this.facets[i].normal.z = (offY*sin + offZ*cos);

            this.facets[i].invalidate();

        }
    } finally {

        cos = null;
        sin = null;

        offY = null;
        offZ = null;

        vts = null;

    }
}


DumShape.prototype.rotY = function(theta, x, z) {

    if (isNaN(x)) {
        x = this.cx;
    }
    if (isNaN(z)) {
        z = this.cz;
    }

    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    var offX = this.cx - x;
    var offZ = this.cz - z;
    this.cx = x + offX*cos - offZ*sin;
    this.cz = z + offX*sin + offZ*cos;


    try {


        //
        // MARK ALL FACETS AS NOT ROTATED
        //
        for (var i = 0; i < this.length; i++) {
            vts = this.facets[i].points;
            for (var j=0; j < this.facets[i].length; j++) {
                vts[j].moved = false;
            }
        }

        //
        // ROTATE ALL FACETS
        //
        for (var i = 0; i < this.length; i++) {

            vts = this.facets[i].points;

            for (var j=0; j < this.facets[i].length; j++) {
                if (!vts[j].moved) {
                    offX = vts[j].x - x;
                    offZ = vts[j].z - z;
                    vts[j].x = x + offX*cos - offZ*sin;
                    vts[j].z = z + offX*sin + offZ*cos;
                    vts[j].moved = true;
                }
            }
            offX = this.facets[i].cx - x;
            offZ = this.facets[i].cz - z;
            this.facets[i].cx = (x + offX*cos - offZ*sin);
            this.facets[i].cz = (z + offX*sin + offZ*cos);

            offX = this.facets[i].direct.x;
            offZ = this.facets[i].direct.z;
            this.facets[i].direct.x = (offX*cos - offZ*sin);
            this.facets[i].direct.z = (offX*sin + offZ*cos);

            offX = this.facets[i].normal.x;
            offZ = this.facets[i].normal.z;
            this.facets[i].normal.x = (offX*cos - offZ*sin);
            this.facets[i].normal.z = (offX*sin + offZ*cos);

            this.facets[i].invalidate();

        }

    } finally {

        cos = null;
        sin = null;

        offX = null;
        offZ = null;

        vts = null;

    }
}



DumShape.prototype.rotZ = function(theta, x, y) {

    if (isNaN(x)) {
        x = this.cx;
    }
    if (isNaN(y)) {
        y = this.cy;
    }


    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    var offX = this.cx - x;
    var offY = this.cy - y;
    this.cx = x + offX*cos - offY*sin;
    this.cy = y + offX*sin + offY*cos;


    try {


        //
        // MARK ALL FACETS AS NOT ROTATED
        //
        for (var i = 0; i < this.length; i++) {
            vts = this.facets[i].points;
            for (var j=0; j < this.facets[i].length; j++) {
                vts[j].moved = false;
            }
        }

        //
        // ROTATE ALL FACETS
        //
        for (var i = 0; i < this.length; i++) {

            vts = this.facets[i].points;

            for (var j=0; j < this.facets[i].length; j++) {
                if (!vts[j].moved) {
                    offX = vts[j].x - x;
                    offY = vts[j].y - y;
                    vts[j].x = x + offX*cos - offY*sin;
                    vts[j].y = y + offX*sin + offY*cos;
                }
            }

            offX = this.facets[i].cx - x;
            offY = this.facets[i].cy - y;
            this.facets[i].cx = (x + offX*cos - offY*sin);
            this.facets[i].cy = (y + offX*sin + offY*cos);

            offX = this.facets[i].direct.x;
            offY = this.facets[i].direct.y;
            this.facets[i].direct.x = (offX*cos - offY*sin);
            this.facets[i].direct.y = (offX*sin + offY*cos);

            offX = this.facets[i].normal.x;
            offY = this.facets[i].normal.y;
            this.facets[i].normal.x = (offX*cos - offY*sin);
            this.facets[i].normal.y = (offX*sin + offY*cos);

            this.facets[i].invalidate();
        }

    
    } finally {

        cos = null;
        sin = null;

        offX = null;
        offY = null;

        vts = null;

    }

}


//
// (prx, pry, prz) = coords to rotate around?
// (arx, ary, arz) = 
DumShape.prototype.rot = function(theta, prx, pry, prz, arx, ary, arz) {

    var alpha = null;
    var cosa = null;
    var sina = null;
    var x = null;
    var y = null;
    var z = null;
    var beta = null;

    var cost = null;
    var sint = null;
    var cosNa = null;
    var sinNa = null;
    var cosb = null;
    var sinb = null;
    var cosNb = null;
    var sinNb = null;

    var opx = null;
    var opy = null;
    var opz = null;

    var xs = null;
    var ys = null;
    var zs = null;

    try {

        alpha = Math.acos( arz/Math.sqrt(arz*arz + arx*arx) );
        if (arx < 0) alpha = -alpha;

        if (isNaN(alpha)) alpha = 0.0;

        // System.out.println("alpha: "+alpha);

        cosa = Math.cos(alpha);
        sina = Math.sin(alpha);
        x = arx*cosa - arz*sina;
        y = ary;
        z = arx*sina + arz*cosa;
        beta = Math.asin(y/Math.sqrt(y*y + z*z));

        // System.out.println("beta: "+beta);

        cost = Math.cos(theta);
        sint = Math.sin(theta);
        cosNa = Math.cos(-alpha);
        sinNa = Math.sin(-alpha);
        cosb = Math.cos(beta);
        sinb = Math.sin(beta);
        cosNb = Math.cos(-beta);
        sinNb = Math.sin(-beta);

        opx = this.cx - prx;
        opy = this.cy - pry;
        opz = this.cz - prz;

        x = opx*cosa - opz*sina;
        z = opx*sina + opz*cosa;
        y = opy;
        opy = y*cosb - z*sinb;
        opz = y*sinb + z*cosb;
        opx = x;
        x = opx*cost - opy*sint;
        y = opx*sint + opy*cost;
        z = opz;
        opz = y*sinNb + z*cosNb;
        this.cx = prx + x*cosNa - opz*sinNa;
        this.cy = pry + y*cosNb - z*sinNb;
        this.cz = prz + x*sinNa + opz*cosNa;

        opx = this.dx;
        opy = this.dy;
        opz = this.dz;
        x = opx*cosa - opz*sina;
        z = opx*sina + opz*cosa;
        y = opy;
        opy = y*cosb - z*sinb;
        opz = y*sinb + z*cosb;
        opx = x;
        x = opx*cost - opy*sint;
        y = opx*sint + opy*cost;
        z = opz;
        opz = y*sinNb + z*cosNb;
        this.dx = x*cosNa - opz*sinNa;
        this.dy = y*cosNb - z*sinNb;
        this.dz = x*sinNa + opz*cosNa;

        opx = this.nx;
        opy = this.ny;
        opz = this.nz;
        x = opx*cosa - opz*sina;
        z = opx*sina + opz*cosa;
        y = opy;
        opy = y*cosb - z*sinb;
        opz = y*sinb + z*cosb;
        opx = x;
        x = opx*cost - opy*sint;
        y = opx*sint + opy*cost;
        z = opz;
        opz = y*sinNb + z*cosNb;
        this.nx = x*cosNa - opz*sinNa;
        this.ny = y*cosNb - z*sinNb;
        this.nz = x*sinNa + opz*cosNa;


        //
        // MARK ALL FACETS AS NOT ROTATED
        //
        for (var i = 0; i < this.length; i++) {
            vts = this.facets[i].points;
            for (var j = 0; j < this.facets[i].length; j++) {
                vts[j].moved = false;
            }
        }


        for (var i = 0; i < this.length; i++) {
            vts = this.facets[i].points;
            for (var j = 0; j < this.facets[i].length; j++) {

                if (!vts[j].moved) {

                    opx = vts[j].x - prx;
                    opy = vts[j].y - pry;
                    opz = vts[j].z - prz;

                    // rotate Y alpha radians
                    x = opx*cosa - opz*sina;
                    z = opx*sina + opz*cosa;
                    y = opy;

                    // rotate X beta radians 
                    opy = y*cosb - z*sinb;
                    opz = y*sinb + z*cosb;
                    opx = x;

                    // rotate Z theta radians
                    x = opx*cost - opy*sint;
                    y = opx*sint + opy*cost;
                    z = opz;

                    // rotate back and assign values
                    opz = y*sinNb + z*cosNb;

                    vts[j].x = prx + x*cosNa - opz*sinNa;
                    vts[j].y = pry + y*cosNb - z*sinNb;
                    vts[j].z = prz + x*sinNa + opz*cosNa;

                    vts[j].moved = true;
                }
            }

            // rotate centers
            opx = this.facets[i].cx - prx;
            opy = this.facets[i].cy - pry;
            opz = this.facets[i].cz - prz;
            x = opx*cosa - opz*sina;
            z = opx*sina + opz*cosa;
            y = opy;
            opy = y*cosb - z*sinb;
            opz = y*sinb + z*cosb;
            opx = x;
            x = opx*cost - opy*sint;
            y = opx*sint + opy*cost;
            z = opz;
            opz = y*sinNb + z*cosNb;
            this.facets[i].cx = prx + x*cosNa - opz*sinNa;
            this.facets[i].cy = pry + y*cosNb - z*sinNb;
            this.facets[i].cz = prz + x*sinNa + opz*cosNa;

            // rotate directs
            opx = this.facets[i].dx;
            opy = this.facets[i].dy;
            opz = this.facets[i].dz;
            x = opx*cosa - opz*sina;
            z = opx*sina + opz*cosa;
            y = opy;
            opy = y*cosb - z*sinb;
            opz = y*sinb + z*cosb;
            opx = x;
            x = opx*cost - opy*sint;
            y = opx*sint + opy*cost;
            z = opz;
            opz = y*sinNb + z*cosNb;
            this.facets[i].dx = x*cosNa - opz*sinNa;
            this.facets[i].dy = y*cosNb - z*sinNb;
            this.facets[i].dz = x*sinNa + opz*cosNa;

            // rotate normals
            opx = this.facets[i].nx;
            opy = this.facets[i].ny;
            opz = this.facets[i].nz;
            x = opx*cosa - opz*sina;
            z = opx*sina + opz*cosa;
            y = opy;
            opy = y*cosb - z*sinb;
            opz = y*sinb + z*cosb;
            opx = x;
            x = opx*cost - opy*sint;
            y = opx*sint + opy*cost;
            z = opz;
            opz = y*sinNb + z*cosNb;
            this.facets[i].nx = x*cosNa - opz*sinNa;
            this.facets[i].ny = y*cosNb - z*sinNb;
            this.facets[i].nz = x*sinNa + opz*cosNa;

            this.facets[i].invalidate();

        }
    } finally {

        alpha = null;
        cosa = null;
        sina = null;
        x = null;
        y = null;
        z = null;
        beta = null;

        cost = null;
        sint = null;
        cosNa = null;
        sinNa = null;
        cosb = null;
        sinb = null;
        cosNb = null;
        sinNb = null;

        opx = null;
        opy = null;
        opz = null;

        xs = null;
        ys = null;
        zs = null;
    }
}


///////////////////////////////////////////////////////////////////////////////
//
// Movement
//
///////////////////////////////////////////////////////////////////////////////



//
// MOVES THIS SHAPE THE SPECIFIED X, Y, Z
//
DumShape.prototype.move = function(x, y, z) {

    this.cx += x;
    this.cy += y;
    this.cz += z;

    var points = null;

    try {

        for (var i = 0; i < this.length; i++) {
            points = this.facets[i].points;
            for (var j=0; j < this.facets[i].length; j++) {
                points[j].moved = false;
            }
        }

        for (var i = 0; i < this.length; i++) {
            points = this.facets[i].points;
            for (var j=0; j < this.facets[i].length; j++) {
                if (!points[j].moved) {
                    points[j].x += x;
                    points[j].y += y;
                    points[j].z += z;
                    points[j].moved = true;
                }
            }
            this.facets[i].cx += x;
            this.facets[i].cy += y;
            this.facets[i].cz += z;

            this.facets[i].invalidate();
        }
    } finally {
        points = null;
    }
}



//
// SETS THE CENTER POINT OF THIS SHAPE
//
DumShape.prototype.center = function(x, y, z) {
    this.cx = x;
    this.cy = y;
    this.cz = z;
}



//
// SETS THE NORMAL UNIT VECTOR FOR THIS SHAPE
//
DumShape.prototype.normal = function(x, y, z) {
    this.nx = x;
    this.ny = y;
    this.nz = z;
}


//
// SETS THE DIRECTION UNIT VECTOR FOR THIS SHAPE
//
DumShape.prototype.direct = function(x, y, z) {
    this.dx = x;
    this.dy = y;
    this.dz = z;
}





//
// NORMALIZE VERTICES
//
DumShape.prototype.computeVertexNormals = function() {
return;
    //
    // ANTI-GRAVITY
    //
    for (var i = 0; i < this.length; i++) {  // iterate trough each facet in this shape

        var facet = this.facets[i];

        for (var j = 0; j < facet.length; j++) {

            var point = facet.points[j];

            var gx = 0;
            var gy = 0;
            var gz = 0;

            for (var k = 0; k < facet.length; k++) {
                if (k != j) {
                    var d2 =
                        (point.x - facet.points[k].x) * (point.x - facet.points[k].x)
                      + (point.y - facet.points[k].y) * (point.y - facet.points[k].y)
                      + (point.z - facet.points[k].z) * (point.z - facet.points[k].z)
                    ;
                    if (d2 > 0) {
                        gx += (point.x - facet.points[k].x) / d2;
                        gy += (point.y - facet.points[k].y) / d2;
                        gz += (point.z - facet.points[k].z) / d2;
                    }
                }
            }
            point.normal = DumPoint.oppositeNormal(gx, gy, gz);
        }
    }
}






//
//
// SHAPE
//
// A GROUP OF FACETS.  A POLYHEDRON CONSISTING OF ONE OR MORE POLYGONS.
// ROTATIONS AND TRANSFORMS ARE DONE HERE.
//
function DumGroup(shapes, len) {
    this.shapes = new Array();
    this.length = 0;
    if (!len || len < 0) {
        if (shapes && shapes.length) {
            this.length = shapes.length;
        } else {
            this.length = 0;
        }
    } else if (shapes && shapes.length <= len) {
        this.length = len;
    } else {
        this.length = 0;
    }

    this.cx = 0;
    this.cy = 0;
    this.cz = 0;

    for (var i = 0; i < this.length; i++) {
        this.shapes[i] = shapes[i];
        this.cx += shapes[i].cx;
        this.cy += shapes[i].cy;
        this.cz += shapes[i].cz;
    }
    this.cx /= this.length;
    this.cy /= this.length;
    this.cz /= this.length;

}



DumGroup.prototype.addShape = function(shape) {
    if (shape == null) {
        return;
    }
    if (this.length) {
        this.cx *= this.length;
        this.cy *= this.length;
        this.cz *= this.length;
    } else {
        this.cx = 0;
        this.cy = 0;
        this.cz = 0;
    }
    this.shapes[this.length++] = shape;
    this.cx += shape.cx;
    this.cy += shape.cy;
    this.cz += shape.cz;
    this.cx /= this.length;
    this.cy /= this.length;
    this.cz /= this.length;
}


DumGroup.prototype.center = function(x, y, z) {
    this.cx = x;
    this.cy = y;
    this.cz = z;
}



DumGroup.prototype.rotX = function(theta, y, z) {

    if (!theta) {
        return;
    }
    if (isNaN(z)) {
        z = this.cz;
    }
    if (isNaN(y)) {
        y = this.cy;
    }

    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    var offY = this.cy - y;
    var offZ = this.cz - z;
    this.cy = y + offY*cos - offZ*sin;
    this.cz = z + offY*sin + offZ*cos;

    var vts = null;

    try {


        //
        // MARK ALL FACETS AS NOT ROTATED
        //
        for (var h = 0; h < this.length; h++) {
            for (var i = 0; i < this.shapes[h].length; i++) {
                vts = this.shapes[h].facets[i].points;
                for (var j = 0; j < this.shapes[h].facets[i].length; j++) {
                    vts[j].moved = false;
                }
            }
        }

        //
        // ROTATE ALL FACETS
        //
        for (var h = 0; h < this.length; h++) {

            offY = this.shapes[h].cy - y;
            offZ = this.shapes[h].cz - z;
            this.shapes[h].cy = y + offY*cos - offZ*sin;
            this.shapes[h].cz = z + offY*sin + offZ*cos;

            for (var i = 0; i < this.shapes[h].length; i++) {

                vts = this.shapes[h].facets[i].points;

                for (var j = 0; j < this.shapes[h].facets[i].length; j++) {
                    if (!vts[j].moved) {
                        offY = vts[j].y - y;
                        offZ = vts[j].z - z;
                        vts[j].y = y + offY*cos - offZ*sin;
                        vts[j].z = z + offY*sin + offZ*cos;
                        vts[j].moved = true;
                    }
                }

                offY = this.shapes[h].facets[i].cy - y;
                offZ = this.shapes[h].facets[i].cz - z;
                this.shapes[h].facets[i].cy = (y + offY*cos - offZ*sin);
                this.shapes[h].facets[i].cz = (z + offY*sin + offZ*cos);

                offY = this.shapes[h].facets[i].direct.y;
                offZ = this.shapes[h].facets[i].direct.z;
                this.shapes[h].facets[i].direct.y = (offY*cos - offZ*sin);
                this.shapes[h].facets[i].direct.z = (offY*sin + offZ*cos);

                offY = this.shapes[h].facets[i].normal.y;
                offZ = this.shapes[h].facets[i].normal.z;
                this.shapes[h].facets[i].normal.y = (offY*cos - offZ*sin);
                this.shapes[h].facets[i].normal.z = (offY*sin + offZ*cos);

                this.shapes[h].facets[i].invalidate();
            }
        }
    } finally {

        cos = null;
        sin = null;

        offY = null;
        offZ = null;

        vts = null;

    }
}


DumGroup.prototype.rotY = function(theta, x, z) {

    if (!theta) {
        return;
    }
    if (isNaN(x)) {
        x = this.cx;
    }
    if (isNaN(z)) {
        z = this.cz;
    }

    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    var offX = this.cx - x;
    var offZ = this.cz - z;
    this.cx = x + offX*cos - offZ*sin;
    this.cz = z + offX*sin + offZ*cos;

    try {


        //
        // MARK ALL FACETS AS NOT ROTATED
        //
        for (var h = 0; h < this.length; h++) {
            for (var i = 0; i < this.shapes[h].length; i++) {
                vts = this.shapes[h].facets[i].points;
                for (var j = 0; j < this.shapes[h].facets[i].length; j++) {
                    vts[j].moved = false;
                }
            }
        }

        //
        // ROTATE ALL FACETS
        //
        for (var h = 0; h < this.length; h++) {

            offX = this.shapes[h].cx - x;
            offZ = this.shapes[h].cz - z;
            this.shapes[h].cx = x + offX*cos - offZ*sin;
            this.shapes[h].cz = z + offX*sin + offZ*cos;

            for (var i = 0; i < this.shapes[h].length; i++) {

                vts = this.shapes[h].facets[i].points;

                for (var j=0; j < this.shapes[h].facets[i].length; j++) {
                    if (!vts[j].moved) {
                        offX = vts[j].x - x;
                        offZ = vts[j].z - z;
                        vts[j].x = x + offX*cos - offZ*sin;
                        vts[j].z = z + offX*sin + offZ*cos;
                        vts[j].moved = true;
                    }
                }
                offX = this.shapes[h].facets[i].cx - x;
                offZ = this.shapes[h].facets[i].cz - z;
                this.shapes[h].facets[i].cx = (x + offX*cos - offZ*sin);
                this.shapes[h].facets[i].cz = (z + offX*sin + offZ*cos);

                offX = this.shapes[h].facets[i].direct.x;
                offZ = this.shapes[h].facets[i].direct.z;
                this.shapes[h].facets[i].direct.x = (offX*cos - offZ*sin);
                this.shapes[h].facets[i].direct.z = (offX*sin + offZ*cos);

                offX = this.shapes[h].facets[i].normal.x;
                offZ = this.shapes[h].facets[i].normal.z;
                this.shapes[h].facets[i].normal.x = (offX*cos - offZ*sin);
                this.shapes[h].facets[i].normal.z = (offX*sin + offZ*cos);

                this.shapes[h].facets[i].invalidate();
            }
        }

    } finally {

        cos = null;
        sin = null;

        offX = null;
        offZ = null;

        vts = null;

    }
}



DumGroup.prototype.rotZ = function(theta, x, y) {

    if (!theta) {
        return;
    }
    if (isNaN(x)) {
        x = this.cx;
    }
    if (isNaN(y)) {
        y = this.cy;
    }

    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    var offX = this.cx - x;
    var offY = this.cy - y;
    this.cx = x + offX*cos - offY*sin;
    this.cy = y + offX*sin + offY*cos;

    try {


        //
        // MARK ALL FACETS AS NOT ROTATED
        //
        for (var h = 0; h < this.length; h++) {
            for (var i = 0; i < this.shapes[h].length; i++) {
                vts = this.shapes[h].facets[i].points;
                for (var j = 0; j < this.shapes[h].facets[i].length; j++) {
                    vts[j].moved = false;
                }
            }
        }

        //
        // ROTATE ALL FACETS
        //
        for (var h = 0; h < this.length; h++) {

            offX = this.shapes[h].cx - x;
            offY = this.shapes[h].cy - y;
            this.shapes[h].cx = x + offX*cos - offY*sin;
            this.shapes[h].cy = y + offX*sin + offY*cos;

            for (var i = 0; i < this.shapes[h].length; i++) {

                vts = this.shapes[h].facets[i].points;

                for (var j = 0; j < this.shapes[h].facets[i].length; j++) {
                    if (!vts[j].moved) {
                        offX = vts[j].x - x;
                        offY = vts[j].y - y;
                        vts[j].x = x + offX*cos - offY*sin;
                        vts[j].y = y + offX*sin + offY*cos;
                    }
                }

                offX = this.shapes[h].facets[i].cx - x;
                offY = this.shapes[h].facets[i].cy - y;
                this.shapes[h].facets[i].cx = (x + offX*cos - offY*sin);
                this.shapes[h].facets[i].cy = (y + offX*sin + offY*cos);

                offX = this.shapes[h].facets[i].direct.x;
                offY = this.shapes[h].facets[i].direct.y;
                this.shapes[h].facets[i].direct.x = (offX*cos - offY*sin);
                this.shapes[h].facets[i].direct.y = (offX*sin + offY*cos);

                offX = this.shapes[h].facets[i].normal.x;
                offY = this.shapes[h].facets[i].normal.y;
                this.shapes[h].facets[i].normal.x = (offX*cos - offY*sin);
                this.shapes[h].facets[i].normal.y = (offX*sin + offY*cos);

                this.shapes[h].facets[i].invalidate();

            }
        }

    
    } finally {

        cos = null;
        sin = null;

        offX = null;
        offY = null;

        vts = null;

    }

}








//
// MOVES THIS GROUP THE SPECIFIED X, Y, Z
//
DumGroup.prototype.move = function(x, y, z) {

    if (!x && !y && !z) {
        return;
    }

    var points = null;

    try {

        this.cx += x;
        this.cy += y;
        this.cz += z;

        for (var h = 0; h < this.length; h++) {
            for (var i = 0; i < this.shapes[h].length; i++) {
                vts = this.shapes[h].facets[i].points;
                for (var j = 0; j < this.shapes[h].facets[i].length; j++) {
                    vts[j].moved = false;
                }
                this.shapes[h].facets[i].moved = false;
            }
        }

        for (var h = 0; h < this.length; h++) {

            this.shapes[h].cx += x;
            this.shapes[h].cy += y;
            this.shapes[h].cz += z;

            for (var i = 0; i < this.shapes[h].length; i++) {
                if (!this.shapes[h].facets[i].moved) {
                    points = this.shapes[h].facets[i].points;
                    for (var j = 0; j < this.shapes[h].facets[i].length; j++) {
                        if (!points[j].moved) {
                            points[j].x += x;
                            points[j].y += y;
                            points[j].z += z;
                            points[j].moved = true;
                        }
                    }
                    this.shapes[h].facets[i].cx += x;
                    this.shapes[h].facets[i].cy += y;
                    this.shapes[h].facets[i].cz += z;
                    this.shapes[h].facets[i].moved = true;
                }
                this.shapes[h].facets[i].invalidate();
            }
        }
    } finally {
        points = null;
    }
}








//
//
//
//         __====__       __====__
//        /--------\     /--------\
//      /----*****---\ /---*****----\
//     /--***     **--.--**     ***--\
//    |--**         **-**         **--|
//    |--*           ***           *--||
//    |--*            *            *--|
//     \--*                       *--/
//      \--**       ~DUM~       **--/
//       \---*                 *---/
//         \--**             **--/
//          \---**         **---/
//            \---**     **---/
//              \---** **---/
//                \---*---/
//                  \---/
//                   \-/
//                    !
//
//
