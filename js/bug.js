
function Bug(x, y, size) {

    this.bug_id = 'bugs_' + Bug.all.length;
    this.zIndex = 200 + Bug.all.length;

    this.size = size;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;

    this.fillColor = '#000';
    this.lineColor = '#000';

    this.leg_root_xs = new Array();
    this.leg_root_ys = new Array();
    this.leg_knee_xs = new Array();
    this.leg_knee_ys = new Array();
    this.leg_foot_xs = new Array();
    this.leg_foot_ys = new Array();

    this.steps = [0,0,0,0,0,0];

    this.leg_root_angles = new Array();
    this.leg_knee_angles = new Array();

    this.leg_knee_lengths = [1,1,1,1,1,1];

    this.antenna_root_xs = new Array();
    this.antenna_root_ys = new Array();

    this.antenna_ctl1_xs = new Array();
    this.antenna_ctl1_ys = new Array();
    this.antenna_ctl2_xs = new Array();
    this.antenna_ctl2_ys = new Array();

    this.antenna_head_xs = new Array();
    this.antenna_head_ys = new Array();

    this.antenna_angles = [
        Math.random() * 0.01,
        Math.random() * 0.01
    ];

    this.brain = new BugBrain(this);

    this.container = null;   // DOM object container of bug
    this.bound_x = null;
    this.bound_y = null;
    this.bound_w = null;
    this.bound_h = null;

    Bug.all[Bug.all.length] = this;
    this.is_ok = true;

    document.addEventListener('dblclick', function(event) {Bug.all[Bug.all.length-1].dblclick(event)});

}


Bug.prototype.setZ = function(z) {
    this.zIndex = z;
}

Bug.animateAll = function() {
    var idle = null;
    try {
        idle = true;
        for (var i = 0; i < Bug.all.length; i++) {
            if (Bug.all[i].hiding && !Bug.all[i].isShowing()) {
            } else {
                idle = false;
                Bug.all[i].paint();
            }
        }
        if (idle) {
            setTimeout('Bug.animateAll()', 500);
        } else {
            setTimeout('Bug.animateAll()', 50);
        }
    } finally {
        idle = null;
    }
}


Bug.prototype.getML = function() {
    var ml = null;
    try {
        ml =
            '<div id="' + this.bug_id + '_div"'
          + ' style="position:absolute;z-index:' + this.zIndex + ';width:' + Math.round(this.size) + 'px;height:' + Math.round(this.size) + 'px;padding:0px;margin:0px"'
          + ' onmouseover="Bug.mouseover(\'' + this.bug_id + '\')" '
          + ' onmousemove="Bug.mousemove(\'' + this.bug_id + '\')" '
          + ' onmouseout="Bug.mouseout(\'' + this.bug_id + '\')" '
          + ' onclick="Bug.click(\'' + this.bug_id + '\')" '
          + '>'
        ;
        if (!!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect)) {
            ml += ''
              + '<svg id="' + this.bug_id + '_svg" width="' + Math.round(this.size) + '" height="' + Math.round(this.size) + '">'
              + '</svg>'
            ;
        } else {
            ml += ''
              + '<canvas id="' + this.bug_id + '_can" width="' + Math.round(this.size) + '" height="' + Math.round(this.size) + '">'
              + '</canvas>'
            ;
        }
        ml += '</div>';
        return ml;
    } finally {
        ml = null;
    }
}



Bug.prototype.insertInPage = function() {
    var n = null;
    try {
        n = document.createElement('div');
        n.innerHTML = this.getML();
        document.body.appendChild(n);
    } finally {
        n = null;
    }
}





Bug.prototype.setDirection = function(angle, speed) {
    this.angle = angle;
    this.vx = -Math.cos(angle) * speed;
    this.vy = -Math.sin(angle) * speed;
}


Bug.prototype.setBounds = function(x, y, w, h) {
    this.bound_x = x;
    this.bound_y = y;
    this.bound_w = w;
    this.bound_h = h;
}

Bug.prototype.setContainer = function(obj) {
    this.container = obj;
}

Bug.prototype.setContainerId = function(id) {
    this.container = Bug.getById(id);
}





Bug.mouseover = function(id) {
    for (var i = 0; i < Bug.all.length; i++) {
        if (Bug.all[i] && Bug.all[i].bug_id == id) {
            Bug.all[i].brain.mouseover();
            Bug.all[i].brain.randomlyFart();
            return;
        }
    }
}

Bug.mousemove = function(id) {
    for (var i = 0; i < Bug.all.length; i++) {
        if (Bug.all[i] && Bug.all[i].bug_id == id) {
            Bug.all[i].brain.mousemove();
            return;
        }
    }
}

Bug.mouseout = function(id) {
    for (var i = 0; i < Bug.all.length; i++) {
        if (Bug.all[i] && Bug.all[i].bug_id == id) {
            Bug.all[i].brain.mouseout();
            return;
        }
    }
}

Bug.click = function(id) {
    for (var i = 0; i < Bug.all.length; i++) {
        if (Bug.all[i] && Bug.all[i].bug_id == id) {
            Bug.all[i].brain.click();
            return;
        }
    }
}



Bug.prototype.isShowing = function() {
    return this.x + this.size/2 > 0 && this.y + this.size/2 > 0;
}

Bug.prototype.setShowing = function(boo) {
    this.brain.setHiding(!boo);
}

Bug.prototype.showFor = function(time) {
    this.brain.setShowTime(time);
}

Bug.prototype.hideFor = function(time) {
    this.brain.setHideTime(time);
}


Bug.all = new Array();
Bug.max_root_angles = [
  Math.PI/4,
  Math.PI/4,
  Math.PI/4,
  Math.PI/4,
  Math.PI/4,
  Math.PI/4
];
Bug.min_root_angles = [
  -Math.PI/7,
  -Math.PI/7,
  -Math.PI/18,
  -Math.PI/18,
  -Math.PI/7,
  -Math.PI/7
];

Bug.max_knee_angles = [
  0,
  0,
  0,
  0,
  0,
  0
];
Bug.min_knee_angles = [
  -Math.PI/10,
  -Math.PI/10,
  -Math.PI/3,
  -Math.PI/3,
  Math.PI/3,
  Math.PI/3
];

Bug.min_knee_lengths = [
  1,
  1,
  0.5,
  0.5,
  1,
  1
];
Bug.getObjNN4 = function(obj, name) {
    var x = obj.layers;
    var foundLayer;
    for (var i=0;i<x.length;i++) {
        if (x[i].id == name) {
            foundLayer = x[i];
        } else if (x[i].layers.length) {
            var tmp = Bug.getObjNN4(x[i], name);
            if (tmp) {
                foundLayer = tmp;
            }
        }
    }
    return foundLayer;
}
Bug.getById = function(id) {
    var elem = null;
    if (document.getElementById) {
        elem = document.getElementById(id);
    } else if (document.all) {
        elem = document.all[id];
        if (!elem) {
            elem = eval('document.all.' + id);
        }
    } else if (document.layers) {
        elem = Bug.getObjNN4(document, id);
    }

    if (!elem) {
        elem = document.getElementById(id);
    }
    return elem;
}
Bug.getX = function(obj) {
    var curleft = 0;
    if (obj && obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft;
            obj = obj.offsetParent;
        }
    } else if (obj && obj.x) {
        curleft += obj.x;
    }
    return curleft;
}
Bug.getY = function(obj) {
    var curtop = 0;
    if (obj && obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj && obj.y) {
        curtop += obj.y;
    }
    return curtop;
}
Bug.getWidth = function(obj) {
    if (!obj) {
        return 0;
    }
    if (obj.clip && obj.clip.width) {
        return obj.clip.width;
    }
    if (obj.offsetWidth) {
        return obj.offsetWidth;
    }
    if (obj.width) {
        return obj.width;
    }
    if (obj.w) {
        return obj.w;
    }
    if (obj.style && obj.style.width) {
        return obj.style.width;
    }
    if (obj.style && obj.style.pixelWidth) {
        return obj.style.pixelWidth;
    }
    return -1;
}
Bug.getHeight = function(obj) {
    if (!obj) {
        return 0;
    }
    if (obj.clip && obj.clip.height) {
        return obj.clip.height;
    }
    if (obj.offsetHeight) {
        return obj.offsetHeight;
    }
    if (obj.height) {
        return obj.height;
    }
    if (obj.h) {
        return obj.h;
    }
    if (obj.style && obj.style.height) {
        return obj.style.height;
    }
    if (obj.style && obj.style.pixelHeight) {
        return obj.style.pixelHeight;
    }
    return -1;
}
Bug.wtf_event = function(e) {
    if (!e) {
        if (window && window.event) {
            return window.event;
        }
        if (arguments && arguments[0]) {
            return arguments[0];
        }
    }
}
Bug._common_last_mouse_x = 0;
Bug._common_last_mouse_y = 0;
Bug.getMouseX = function(from, e) {
    if (typeof Page !== 'undefined') return Page.getMouseX(from, e);
    if (!e) e = Bug.wtf_event(e);
    if (!e) return _common_last_mouse_x;
    if (e.type && e.type.indexOf('mouse') < 0 && e.type.indexOf('click') < 0) {
        return _common_last_mouse_x;
    }
    if (e.pageX || e.pageY) {
        _common_last_mouse_x = e.pageX;
    } else {
        _common_last_mouse_x = document.layers ? e.pageX : e.clientX;
    }
    _common_last_mouse_x = _common_last_mouse_x - (from ? getX(from) : document.body.scrollLeft);
    return _common_last_mouse_x;
}
Bug.getMouseY = function(from, e) {
    if (typeof Page !== 'undefined') return Page.getMouseY(from, e);
    if (!e) e = Bug.wtf_event(e);
    if (!e) return _common_last_mouse_y;
    if (e.type && e.type.indexOf('mouse') < 0 && e.type.indexOf('click') < 0) {
        return _common_last_mouse_y;
    }
    if (e.pageX || e.pageY) {
        _common_last_mouse_y = e.pageY;
    } else {
        _common_last_mouse_y = document.layers ? e.pageY : e.clientY;
    }
    _common_last_mouse_y = _common_last_mouse_y - (from ? getY(from) : document.body.scrollTop);
    return _common_last_mouse_y;
}



Bug.svg_line = function(svg, line_id, path, x1, y1, x2, y2, fill, stroke, style) {
    var line = null;
    try {
        if (!fill) fill = "black";
        line = Bug.getById(line_id);
        if (!line) {
            line = document.createElementNS('http://www.w3.org/2000/svg', (path ? 'path' : 'line'));
            line.setAttribute('id', line_id);
            svg.append(line);
        }
        if (path) {
            line.setAttribute('d', path);
        } else {
            line.setAttribute('x1', x1 + 'px');
            line.setAttribute('y1', y1 + 'px');
            line.setAttribute('x2', x2 + 'px');
            line.setAttribute('y2', y2 + 'px');
        }
        line.setAttribute("stroke", (stroke ? stroke : "black"))
        if (style) {
            line.setAttribute("style", style);
        } else {
            line.setAttribute("style", "stroke:" + (stroke ? stroke : "black") + ";stroke-width:1px;stroke-join:round;stroke-cap:round;fill:" + (path && (path.indexOf('z') >= 0 || path.indexOf('Z') >= 0) ? fill : "none") + ";");
        }
    } finally {
        line = null;
    }
}


Bug.prototype.paint = function() {

    var div = null;
    var svg = null;
    var can = null;
    var ctx = null;
    var dcx = 0;
    var dcy = 0;

    try {

        this.brain.think();

        if (!this.is_ok) {
            return;
        }

        div = Bug.getById(this.bug_id + '_div');
        if (!div) {
            this.insertInPage();
            div = Bug.getById(this.bug_id + '_div');
            if (!div) {
                this.is_ok = false;
                return;
            }
        }
        svg = Bug.getById(this.bug_id + '_svg');
        can = Bug.getById(this.bug_id + '_can');
        if (!div || (!can && !svg)) {
            return;
        }



        dcx = Math.round(this.x) - this.x;
        dcy = Math.round(this.y) - this.y;

        this.x += this.vx;
        this.y += this.vy;
        div.style.left = Math.round(this.x - this.size/2) + 'px';
        div.style.top = Math.round(this.y - this.size/2) + 'px';


    //    if (!div.mouseover) {
    //   mouseover="Bug.mouseover()"'
    //  + ' onmouseout="Bug.mouseout(\'' + this.bug_id + '\')"'



        if (can) {
            ctx = can.getContext('2d');
            if (!ctx) {
                return;
            }

            ctx.clearRect(0, 0, can.width, can.height);

            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.lineWidth = this.size / 20;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
        }





        //
        // LEGS
        //
        //     head
        //      /\
        //   (1)  (0)
        //   (3)  (2)
        //   (5)  (4)
        //
        this.leg_root_xs[0] = dcx + this.size / 2 - Math.cos(this.angle) * this.size/12 + Math.cos(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_ys[0] = dcy + this.size / 2 - Math.sin(this.angle) * this.size/12 + Math.sin(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_xs[1] = dcx + this.size / 2 - Math.cos(this.angle) * this.size/12 - Math.cos(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_ys[1] = dcy + this.size / 2 - Math.sin(this.angle) * this.size/12 - Math.sin(this.angle - Math.PI / 2) * this.size/9;

        this.leg_root_xs[2] = dcx + this.size / 2 + Math.cos(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_ys[2] = dcy + this.size / 2 + Math.sin(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_xs[3] = dcx + this.size / 2 - Math.cos(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_ys[3] = dcy + this.size / 2 - Math.sin(this.angle - Math.PI / 2) * this.size/9;

        this.leg_root_xs[4] = dcx + this.size / 2 + Math.cos(this.angle) * this.size/9 + Math.cos(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_ys[4] = dcy + this.size / 2 + Math.sin(this.angle) * this.size/9 + Math.sin(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_xs[5] = dcx + this.size / 2 + Math.cos(this.angle) * this.size/9 - Math.cos(this.angle - Math.PI / 2) * this.size/9;
        this.leg_root_ys[5] = dcy + this.size / 2 + Math.sin(this.angle) * this.size/9 - Math.sin(this.angle - Math.PI / 2) * this.size/9;

        if (this.vx != 0 || this.vy != 0) {

           // this.angle = Math.atan(this.vy, this.vx) - Math.PI;
           // if (this.vx == 0) {
           //     if (this.vy > 0) {
           //         this.angle = -Math.PI / 2;
           //     } else {
           //         this.angle = Math.PI / 2;
           //     }
           // }



            this.steps[0] += Math.sqrt(this.vx * this.vx + this.vy * this.vy) * 25 / this.size;
            this.steps[1] = (this.steps[0] + 5) % 10;
            this.steps[2] = (this.steps[0] + 6) % 10;
            this.steps[3] = (this.steps[1] + 6) % 10;
            this.steps[4] = (this.steps[2] + 6) % 10;
            this.steps[5] = (this.steps[3] + 6) % 10;


            for (var i = 0; i < 6; i++) {
                if (this.steps[i] > 10) {
                    this.steps[i] = 0;
                }
            }

            for (var i = 0; i < 2; i++) {

                if (this.steps[0 + i] < 7) {
                    this.leg_root_angles[0 + i] = Bug.max_root_angles[0 + i] - (this.steps[0 + i] / 7) * (Bug.max_root_angles[0 + i] - Bug.min_root_angles[0 + i]);
                    this.leg_knee_lengths[0 + i] = 1;
                } else {
                    this.leg_root_angles[0 + i] = Bug.min_root_angles[0 + i] + ((this.steps[0 + i] - 7) / 3) * (Bug.max_root_angles[0 + i] - Bug.min_root_angles[0 + i]);
                    this.leg_knee_lengths[0 + i] = 1;
                }
                if (this.steps[0 + i] < 7) {
                    this.leg_knee_angles[0 + i] = Bug.max_knee_angles[0 + i] - (this.steps[0 + i] / 7) * (Bug.max_knee_angles[0 + i] - Bug.min_knee_angles[0 + i]);
                    this.leg_knee_lengths[0 + i] = 1;
                } else {
                    this.leg_knee_angles[0 + i] = Bug.min_knee_angles[0 + i] + ((this.steps[0 + i] - 7) / 3) * (Bug.max_knee_angles[0 + i] - Bug.min_knee_angles[0 + i]);
                    this.leg_knee_lengths[0 + i] = 1;
                }


                if (this.steps[2 + i] < 7) {
                    this.leg_root_angles[2 + i] = Bug.max_root_angles[2 + i] - (this.steps[2 + i] / 7) * (Bug.max_root_angles[2 + i] - Bug.min_root_angles[2 + i]);
                } else {
                    this.leg_root_angles[2 + i] = Bug.min_root_angles[2 + i] + ((this.steps[2 + i] - 7) / 3) * (Bug.max_root_angles[2 + i] - Bug.min_root_angles[2 + i]);
                }
                if (this.steps[2 + i] < 7) {
                    this.leg_knee_angles[2 + i] = Bug.max_knee_angles[2 + i] - (this.steps[2 + i] / 7) * (Bug.max_knee_angles[2 + i] - Bug.min_knee_angles[2 + i]);
                    this.leg_knee_lengths[2 + i] = Math.abs(this.steps[2 + i] - 3.5) / 3.5;
                } else {
                    this.leg_knee_angles[2 + i] = Bug.min_knee_angles[2 + i] + ((this.steps[2 + i] - 7) / 3) * (Bug.max_knee_angles[2 + i] - Bug.min_knee_angles[2 + i]);
                    this.leg_knee_lengths[2 + i] = 1;
                }

                if (this.steps[4 + i] < 7) {
                    // going down
                    this.leg_root_angles[4 + i] = Bug.max_root_angles[4 + i] - (this.steps[4 + i] / 7) * (Bug.max_root_angles[4 + i] - Bug.min_root_angles[4 + i]);
                } else {
                    // going up
                    this.leg_root_angles[4 + i] = Bug.min_root_angles[4 + i] + ((this.steps[4 + i] - 7) / 3) * (Bug.max_root_angles[4 + i] - Bug.min_root_angles[4 + i]);
                }
                if (this.steps[4 + i] < 7) {
                    // going down
                    this.leg_knee_angles[4 + i] = Bug.max_knee_angles[4 + i] - (this.steps[4 + i] / 7) * (Bug.max_knee_angles[4 + i] - Bug.min_knee_angles[4 + i]);
                    this.leg_knee_lengths[4 + i] = (this.steps[4 + i] / 7);
                } else {
                    // going up
                    this.leg_knee_angles[4 + i] = Bug.min_knee_angles[4 + i] + ((this.steps[4 + i] - 7) / 3) * (Bug.max_knee_angles[4 + i] - Bug.min_knee_angles[4 + i]);
                    this.leg_knee_lengths[4 + i] = ((10 - this.steps[4 + i]) / 3);
                }
            }




            this.leg_knee_xs[0] = this.leg_root_xs[0] + Math.cos(this.angle - Math.PI/2 - Math.PI / 12 - this.leg_root_angles[0]) * this.size/6;
            this.leg_knee_ys[0] = this.leg_root_ys[0] + Math.sin(this.angle - Math.PI/2 - Math.PI / 12 - this.leg_root_angles[0]) * this.size/6;
            this.leg_knee_xs[1] = this.leg_root_xs[1] + Math.cos(this.angle + Math.PI/2 + Math.PI / 12 + this.leg_root_angles[1]) * this.size/6;
            this.leg_knee_ys[1] = this.leg_root_ys[1] + Math.sin(this.angle + Math.PI/2 + Math.PI / 12 + this.leg_root_angles[1]) * this.size/6;

            this.leg_foot_xs[0] = this.leg_knee_xs[0] - Math.cos(this.angle + Math.PI/12 + this.leg_knee_angles[0]) * this.size/9 * this.leg_knee_lengths[0];
            this.leg_foot_ys[0] = this.leg_knee_ys[0] - Math.sin(this.angle + Math.PI/12 + this.leg_knee_angles[0]) * this.size/9 * this.leg_knee_lengths[0];
            this.leg_foot_xs[1] = this.leg_knee_xs[1] - Math.cos(this.angle - Math.PI/12 - this.leg_knee_angles[1]) * this.size/9 * this.leg_knee_lengths[1];
            this.leg_foot_ys[1] = this.leg_knee_ys[1] - Math.sin(this.angle - Math.PI/12 - this.leg_knee_angles[1]) * this.size/9 * this.leg_knee_lengths[1];

            this.leg_knee_xs[2] = this.leg_root_xs[2] + Math.cos(this.angle - Math.PI/2 + Math.PI / 12 - this.leg_root_angles[2]) * this.size/7;
            this.leg_knee_ys[2] = this.leg_root_ys[2] + Math.sin(this.angle - Math.PI/2 + Math.PI / 12 - this.leg_root_angles[2]) * this.size/7;
            this.leg_knee_xs[3] = this.leg_root_xs[3] + Math.cos(this.angle + Math.PI/2 - Math.PI / 12 + this.leg_root_angles[3]) * this.size/7;
            this.leg_knee_ys[3] = this.leg_root_ys[3] + Math.sin(this.angle + Math.PI/2 - Math.PI / 12 + this.leg_root_angles[3]) * this.size/7;

            this.leg_foot_xs[2] = this.leg_knee_xs[2] + Math.cos(this.angle - Math.PI/3 + this.leg_knee_angles[2]) * this.size/12 * this.leg_knee_lengths[2];
            this.leg_foot_ys[2] = this.leg_knee_ys[2] + Math.sin(this.angle - Math.PI/3 + this.leg_knee_angles[2]) * this.size/12 * this.leg_knee_lengths[2];
            this.leg_foot_xs[3] = this.leg_knee_xs[3] + Math.cos(this.angle + Math.PI/3 - this.leg_knee_angles[3]) * this.size/12 * this.leg_knee_lengths[3];
            this.leg_foot_ys[3] = this.leg_knee_ys[3] + Math.sin(this.angle + Math.PI/3 - this.leg_knee_angles[3]) * this.size/12 * this.leg_knee_lengths[3];

            this.leg_knee_xs[4] = this.leg_root_xs[4] + Math.cos(this.angle - Math.PI/2 + Math.PI / 9 - this.leg_root_angles[4]) * this.size/7;
            this.leg_knee_ys[4] = this.leg_root_ys[4] + Math.sin(this.angle - Math.PI/2 + Math.PI / 9 - this.leg_root_angles[4]) * this.size/7;
            this.leg_knee_xs[5] = this.leg_root_xs[5] + Math.cos(this.angle + Math.PI/2 - Math.PI / 9 + this.leg_root_angles[5]) * this.size/7;
            this.leg_knee_ys[5] = this.leg_root_ys[5] + Math.sin(this.angle + Math.PI/2 - Math.PI / 9 + this.leg_root_angles[5]) * this.size/7;

            this.leg_foot_xs[4] = this.leg_knee_xs[4] + Math.cos(this.angle - Math.PI/5 + this.leg_knee_angles[4]) * this.size/8 * this.leg_knee_lengths[4];
            this.leg_foot_ys[4] = this.leg_knee_ys[4] + Math.sin(this.angle - Math.PI/5 + this.leg_knee_angles[4]) * this.size/8 * this.leg_knee_lengths[4];
            this.leg_foot_xs[5] = this.leg_knee_xs[5] + Math.cos(this.angle + Math.PI/5 - this.leg_knee_angles[5]) * this.size/8 * this.leg_knee_lengths[5];
            this.leg_foot_ys[5] = this.leg_knee_ys[5] + Math.sin(this.angle + Math.PI/5 - this.leg_knee_angles[5]) * this.size/8 * this.leg_knee_lengths[5];


        } else {

            if (Math.random() < 0.01) {
                this.angle += (Math.random() - 0.5) * 0.1;
            }

            this.leg_knee_xs[0] = this.leg_root_xs[0] + Math.cos(this.angle - Math.PI/2 - Math.PI / 12) * this.size/6;
            this.leg_knee_ys[0] = this.leg_root_ys[0] + Math.sin(this.angle - Math.PI/2 - Math.PI / 12) * this.size/6;
            this.leg_knee_xs[1] = this.leg_root_xs[1] + Math.cos(this.angle + Math.PI/2 + Math.PI / 12) * this.size/6;
            this.leg_knee_ys[1] = this.leg_root_ys[1] + Math.sin(this.angle + Math.PI/2 + Math.PI / 12) * this.size/6;

            this.leg_foot_xs[0] = this.leg_knee_xs[0] - Math.cos(this.angle + Math.PI/12) * this.size/9;
            this.leg_foot_ys[0] = this.leg_knee_ys[0] - Math.sin(this.angle + Math.PI/12) * this.size/9;
            this.leg_foot_xs[1] = this.leg_knee_xs[1] - Math.cos(this.angle - Math.PI/12) * this.size/9;
            this.leg_foot_ys[1] = this.leg_knee_ys[1] - Math.sin(this.angle - Math.PI/12) * this.size/9;

            this.leg_knee_xs[2] = this.leg_root_xs[2] + Math.cos(this.angle - Math.PI/2 + Math.PI / 12) * this.size/7;
            this.leg_knee_ys[2] = this.leg_root_ys[2] + Math.sin(this.angle - Math.PI/2 + Math.PI / 12) * this.size/7;
            this.leg_knee_xs[3] = this.leg_root_xs[3] + Math.cos(this.angle + Math.PI/2 - Math.PI / 12) * this.size/7;
            this.leg_knee_ys[3] = this.leg_root_ys[3] + Math.sin(this.angle + Math.PI/2 - Math.PI / 12) * this.size/7;

            this.leg_foot_xs[2] = this.leg_knee_xs[2] + Math.cos(this.angle - Math.PI/3) * this.size/12;
            this.leg_foot_ys[2] = this.leg_knee_ys[2] + Math.sin(this.angle - Math.PI/3) * this.size/12;
            this.leg_foot_xs[3] = this.leg_knee_xs[3] + Math.cos(this.angle + Math.PI/3) * this.size/12;
            this.leg_foot_ys[3] = this.leg_knee_ys[3] + Math.sin(this.angle + Math.PI/3) * this.size/12;

            this.leg_knee_xs[4] = this.leg_root_xs[4] + Math.cos(this.angle - Math.PI/2 + Math.PI / 9) * this.size/7;
            this.leg_knee_ys[4] = this.leg_root_ys[4] + Math.sin(this.angle - Math.PI/2 + Math.PI / 9) * this.size/7;
            this.leg_knee_xs[5] = this.leg_root_xs[5] + Math.cos(this.angle + Math.PI/2 - Math.PI / 9) * this.size/7;
            this.leg_knee_ys[5] = this.leg_root_ys[5] + Math.sin(this.angle + Math.PI/2 - Math.PI / 9) * this.size/7;

            this.leg_foot_xs[4] = this.leg_knee_xs[4] + Math.cos(this.angle - Math.PI/5) * this.size/8;
            this.leg_foot_ys[4] = this.leg_knee_ys[4] + Math.sin(this.angle - Math.PI/5) * this.size/8;
            this.leg_foot_xs[5] = this.leg_knee_xs[5] + Math.cos(this.angle + Math.PI/5) * this.size/8;
            this.leg_foot_ys[5] = this.leg_knee_ys[5] + Math.sin(this.angle + Math.PI/5) * this.size/8;

        }






        //
        // ANTENNAI
        //
        if (Math.random() < 0.1) {
            this.antenna_angles[0] = (Math.random() - 0.5) * 0.5;
        }
        if (Math.random() < 0.1) {
            this.antenna_angles[1] = (Math.random() - 0.5) * 0.5;
        }

        this.antenna_root_xs[0] = dcx + this.size / 2 - Math.cos(this.angle) * this.size/5 + Math.cos(this.angle - Math.PI / 2) * this.size/16;
        this.antenna_root_ys[0] = dcy + this.size / 2 - Math.sin(this.angle) * this.size/5 + Math.sin(this.angle - Math.PI / 2) * this.size/16;

        this.antenna_ctl1_xs[0] = this.antenna_root_xs[0] - Math.cos(this.angle + Math.PI/8 + this.antenna_angles[0]*1/3) * this.size/9;
        this.antenna_ctl1_ys[0] = this.antenna_root_ys[0] - Math.sin(this.angle + Math.PI/8 + this.antenna_angles[0]*1/3) * this.size/9;

        this.antenna_ctl2_xs[0] = this.antenna_root_xs[0] - Math.cos(this.angle + Math.PI/8 + this.antenna_angles[0]*2/3) * 2*this.size/9;
        this.antenna_ctl2_ys[0] = this.antenna_root_ys[0] - Math.sin(this.angle + Math.PI/8 + this.antenna_angles[0]*2/3) * 2*this.size/9;

        this.antenna_head_xs[0] = this.antenna_root_xs[0] - Math.cos(this.angle + Math.PI/8 + this.antenna_angles[0]) * this.size/3;
        this.antenna_head_ys[0] = this.antenna_root_ys[0] - Math.sin(this.angle + Math.PI/8 + this.antenna_angles[0]) * this.size/3;

        this.antenna_root_xs[1] = dcx + this.size / 2 - Math.cos(this.angle) * this.size/5 - Math.cos(this.angle - Math.PI / 2) * this.size/16;
        this.antenna_root_ys[1] = dcy + this.size / 2 - Math.sin(this.angle) * this.size/5 - Math.sin(this.angle - Math.PI / 2) * this.size/16;

        this.antenna_ctl1_xs[1] = this.antenna_root_xs[1] - Math.cos(this.angle - Math.PI/8 + this.antenna_angles[1]*1/3) * this.size/9;
        this.antenna_ctl1_ys[1] = this.antenna_root_ys[1] - Math.sin(this.angle - Math.PI/8 + this.antenna_angles[1]*1/3) * this.size/9;

        this.antenna_ctl2_xs[1] = this.antenna_root_xs[1] - Math.cos(this.angle - Math.PI/8 + this.antenna_angles[1]*2/3) * 2*this.size/9;
        this.antenna_ctl2_ys[1] = this.antenna_root_ys[1] - Math.sin(this.angle - Math.PI/8 + this.antenna_angles[1]*2/3) * 2*this.size/9;

        this.antenna_head_xs[1] = this.antenna_root_xs[1] - Math.cos(this.angle - Math.PI/8 + this.antenna_angles[1]) * this.size/3;
        this.antenna_head_ys[1] = this.antenna_root_ys[1] - Math.sin(this.angle - Math.PI/8 + this.antenna_angles[1]) * this.size/3;





        if (svg) {

            // LEGS
            for (var i = 0; i < 6; i++) {
                Bug.svg_line(
                    svg, this.id + '_leg_path_' + i,
                    'M' + this.leg_root_xs[i] + ',' + this.leg_root_ys[i] + ' '
                  + 'L' + this.leg_knee_xs[i] + ',' + this.leg_knee_ys[i] + ' '
                  + 'L' + this.leg_foot_xs[i] + ',' + this.leg_foot_ys[i] + ' '
                );
            }

            // BODY
            Bug.svg_line(
                svg, this.id + '_body_path_1',
                'M' + (dcx + this.size / 2 - Math.cos(this.angle) * this.size/12 + Math.cos(this.angle) * this.size/8) + ',' + (dcy + this.size / 2 - Math.sin(this.angle) * this.size/12 + Math.sin(this.angle) * this.size/8) + ' '
              + 'A' + (this.size/8) + ',' + (this.size/8) + ' ' + (this.angle ? this.angle : '0') + ',0,1 ' + (dcx + this.size / 2 - Math.cos(this.angle) * this.size/12 + Math.cos(this.angle + Math.PI*0.5) * this.size/8) + ',' + (dcy + this.size / 2 - Math.sin(this.angle) * this.size/12 + Math.sin(this.angle + Math.PI*0.5) * this.size/8) + ' '
              + 'A' + (this.size/8) + ',' + (this.size/8) + ' ' + (this.angle ? this.angle : '0') + ',0,1 ' + (dcx + this.size / 2 - Math.cos(this.angle) * this.size/12 + Math.cos(this.angle + Math.PI*1.0) * this.size/8) + ',' + (dcy + this.size / 2 - Math.sin(this.angle) * this.size/12 + Math.sin(this.angle + Math.PI*1.0) * this.size/8) + ' '
              + 'A' + (this.size/8) + ',' + (this.size/8) + ' ' + (this.angle ? this.angle : '0') + ',0,1 ' + (dcx + this.size / 2 - Math.cos(this.angle) * this.size/12 + Math.cos(this.angle + Math.PI*1.5) * this.size/8) + ',' + (dcy + this.size / 2 - Math.sin(this.angle) * this.size/12 + Math.sin(this.angle + Math.PI*1.5) * this.size/8) + ' '
              + 'A' + (this.size/8) + ',' + (this.size/8) + ' ' + (this.angle ? this.angle : '0') + ',0,1 ' + (dcx + this.size / 2 - Math.cos(this.angle) * this.size/12 + Math.cos(this.angle + Math.PI*2.0) * this.size/8) + ',' + (dcy + this.size / 2 - Math.sin(this.angle) * this.size/12 + Math.sin(this.angle + Math.PI*2.0) * this.size/8) + ' '
              + 'M' + (dcx + this.size / 2 + Math.cos(this.angle) * this.size/12 + Math.cos(this.angle) * this.size/7.5) + ',' + (dcy + this.size / 2 + Math.sin(this.angle) * this.size/12 + Math.sin(this.angle) * this.size/7.5) + ' '
              + 'A' + (this.size/7.5) + ',' + (this.size/7.5) + ' ' + (this.angle ? this.angle : '0') + ',0,1 ' + (dcx + this.size / 2 + Math.cos(this.angle) * this.size/12 + Math.cos(this.angle + Math.PI*0.5) * this.size/7.5) + ',' + (dcy + this.size / 2 + Math.sin(this.angle) * this.size/12 + Math.sin(this.angle + Math.PI*0.5) * this.size/7.5) + ' '
              + 'A' + (this.size/7.5) + ',' + (this.size/7.5) + ' ' + (this.angle ? this.angle : '0') + ',0,1 ' + (dcx + this.size / 2 + Math.cos(this.angle) * this.size/12 + Math.cos(this.angle + Math.PI*1.0) * this.size/7.5) + ',' + (dcy + this.size / 2 + Math.sin(this.angle) * this.size/12 + Math.sin(this.angle + Math.PI*1.0) * this.size/7.5) + ' '
              + 'A' + (this.size/7.5) + ',' + (this.size/7.5) + ' ' + (this.angle ? this.angle : '0') + ',0,1 ' + (dcx + this.size / 2 + Math.cos(this.angle) * this.size/12 + Math.cos(this.angle + Math.PI*1.5) * this.size/7.5) + ',' + (dcy + this.size / 2 + Math.sin(this.angle) * this.size/12 + Math.sin(this.angle + Math.PI*1.5) * this.size/7.5) + ' '
              + 'A' + (this.size/7.5) + ',' + (this.size/7.5) + ' ' + (this.angle ? this.angle : '0') + ',0,1 ' + (dcx + this.size / 2 + Math.cos(this.angle) * this.size/12 + Math.cos(this.angle + Math.PI*2.0) * this.size/7.5) + ',' + (dcy + this.size / 2 + Math.sin(this.angle) * this.size/12 + Math.sin(this.angle + Math.PI*2.0) * this.size/7.5) + 'Z ',

                0, 0, 0, 0, this.fillColor, this.lineColor
            );
            //ctx.arc(dcx + this.size / 2 - Math.cos(this.angle) * this.size/12, dcy + this.size / 2 - Math.sin(this.angle) * this.size/12, this.size / 6, this.angle + 2 * Math.PI - Math.PI/3, this.angle + Math.PI/3, true);
            //ctx.arc(dcx + this.size / 2 + Math.cos(this.angle) * this.size/12, dcy + this.size / 2 + Math.sin(this.angle) * this.size/12, this.size / 6, this.angle + Math.PI - Math.PI/3, this.angle + Math.PI + Math.PI/3, true);


            // ANTENNAI
            for (var i = 0; i < 2; i++) {
                Bug.svg_line(
                    svg, this.id + '_antenna_line_' + i,
                    'M' + this.antenna_root_xs[i] + ',' + this.antenna_root_ys[i] + ' '
                  + 'C' + this.antenna_ctl1_xs[i] + ',' + this.antenna_ctl1_ys[i] + ' ' + this.antenna_ctl2_xs[i] + ',' + this.antenna_ctl2_ys[i] + ' ' + this.antenna_head_xs[i] + ',' + this.antenna_head_ys[i] + ' '
                    //this.antenna_root_xs[i], this.antenna_root_ys[i], this.antenna_head_xs[i], this.antenna_head_ys[i]
                );
            }

        } else if (can) {

            // LEGS
            for (var i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.moveTo(this.leg_root_xs[i], this.leg_root_ys[i]);
                ctx.lineTo(this.leg_knee_xs[i], this.leg_knee_ys[i]);
                ctx.lineTo(this.leg_foot_xs[i], this.leg_foot_ys[i]);
                ctx.stroke();
            }

            // BODY
            ctx.beginPath();
            ctx.arc(dcx + this.size / 2 - Math.cos(this.angle) * this.size/12, dcy + this.size / 2 - Math.sin(this.angle) * this.size/12, this.size / 6, this.angle + 2 * Math.PI - Math.PI/3, this.angle + Math.PI/3, true);
            ctx.arc(dcx + this.size / 2 + Math.cos(this.angle) * this.size/12, dcy + this.size / 2 + Math.sin(this.angle) * this.size/12, this.size / 6, this.angle + Math.PI - Math.PI/3, this.angle + Math.PI + Math.PI/3, true);
            ctx.closePath();
            ctx.fill();

            // ANTENNAI
            for (var i = 0; i < 2; i++) {
                ctx.beginPath();
                ctx.moveTo(this.antenna_root_xs[i], this.antenna_root_ys[i]);
                ctx.lineTo(this.antenna_head_xs[i], this.antenna_head_ys[i]);
                ctx.stroke();
            }
        }

    } finally {
        div = null;
        svg = null;
        can = null;
        ctx = null;
        dcx = null;
        dcy = null;
    }
}






Bug.prototype.dblclick = function(event) {
    if (this.brain) {
        this.brain.dblclick(event);
    }
}






//
// BUG BRAIN
// CONTROLS BEHAVIORS OF THE BUG
//
function BugBrain(bug) {
    this.bug = bug;
    this.da = 0;
    this.speed = 0.67;
    this.wait_until = 0;
    this.run_away = 0;
    this.hiding = false;
    this.hide_after = null;
    this.show_after = null;
    this.mouse_x = 0;
    this.mouse_y = 0;
    this.goal = null;
}

BugBrain.prototype.setHiding = function(boo) {
    this.hiding = boo;
}

BugBrain.prototype.setShowTime = function(showTime) {
    this.hiding = false;
    this.hide_after = Date.now() + showTime;
    this.show_after = null;
}

BugBrain.prototype.setHideTime = function(hideTime) {
    this.hiding = true;
    this.show_after = Date.now() + hideTime;
    this.hide_after = null;
}

BugBrain.prototype.escape = function(boo) {
    this.wait_until = 0;
    if (boo) {
        this.run_away = Date.now() + 500 + Math.random() * 2000;
    } else {
        this.run_away = 0;
    }
}

BugBrain.prototype.stop = function(ms) {
    this.wait_until = Date.now() + 500 + Math.random() * (ms > 0 ? ms : 2000);
    this.run_away = 0;
    this.hiding = false;
}


BugBrain.prototype.withinAngle = function(min, max) {
    if (this.bug.angle > max || this.bug.angle < min) {
        this.bug.angle = Math.random() * (max - min) + min;
    }
    return this.bug.angle;
}


BugBrain.prototype.randomlyFart = function() {
    if (FartSound && FartSound.randomlyFart) {
        FartSound.randomlyFart();
    }
}

BugBrain.prototype.mouseover = function() {
    this.mouse_x = Bug.getMouseX();
    this.mouse_y = Bug.getMouseY();
    this.escape(true);
}

BugBrain.prototype.mousemove = function() {
    this.mouse_x = Bug.getMouseX();
    this.mouse_y = Bug.getMouseY();
}

BugBrain.prototype.mouseout = function() {
    this.mouse_x = Bug.getMouseX();
    this.mouse_y = Bug.getMouseY();
}

BugBrain.prototype.click = function() {
    this.mouse_x = Bug.getMouseX();
    this.mouse_y = Bug.getMouseY();
}

BugBrain.prototype.dblclick = function(event) {
    this.mouse_x = Bug.getMouseX(null, event);
    this.mouse_y = Bug.getMouseY(null, event);
    this.goal = {'x': this.mouse_x, 'y': this.mouse_y};
    this.run_away = 0;
    this.wait_until = 0;
    this.bug.paint();
}


BugBrain.prototype.think = function() {

    if (this.hide_after && Date.now() > this.hide_after) {
        this.hiding = true;
        this.hide_after = null;
    }
    if (this.show_after && Date.now() > this.show_after) {
        this.hiding = false;
        this.show_after = null;
    }

    this.speed = 1;

    if (this.run_away) {
        if (Date.now() >= this.run_away) {
            this.run_away = 0;
        }
    }
    if (this.wait_until) {
        if (Date.now() >= this.wait_until) {
            this.wait_until = 0;
        } else {
            return;
        }
    }

    if (this.run_away || this.hiding) {
        if (this.bug.angle % (Math.PI * 2) > 0) {
            this.da = -0.1;
        } else if (this.bug.angle % (Math.PI * 2) < 0) {
            this.da = 0.1;
        }
    }
    if (this.bug.container) {
        this.bug.bound_x = Bug.getX(this.bug.container);
        this.bug.bound_y = Bug.getY(this.bug.container);
        this.bug.bound_w = Bug.getWidth(this.bug.container);
        this.bug.bound_h = Bug.getHeight(this.bug.container);
        //console.log('[' + this.bug.bound_x + ', ' + this.bug.bound_y + ', ' + this.bug.bound_w + ', ' + this.bug.bound_h + ']');
    }
    if (this.bug.bound_w > 0 && this.bug.bound_h > 0) {
        if (!this.hiding && this.bug.x - this.bug.size/2 <= this.bug.bound_x) {
            //this.bug.angle = Math.PI + Math.PI * (0.5 - Math.random()) / 3;
            this.withinAngle(Math.PI - Math.PI * 0.5 / 3, Math.PI + Math.PI * 0.5 / 3);
            if (this.goal) this.goal = null;
        }
        if (this.bug.x + this.bug.size/2 > this.bug.bound_x + this.bug.bound_w) {
            //this.bug.angle = 0 + Math.PI * (0.5 - Math.random()) / 3;
            this.withinAngle(-Math.PI * (0.5) / 3, Math.PI * (0.5) / 3);
            if (this.goal) this.goal = null;
        }
        if (this.bug.y - this.bug.size/2 <= this.bug.bound_y) {
            //this.bug.angle = -Math.PI/2 + Math.PI * (0.5 - Math.random()) / 3;
            this.withinAngle(-Math.PI/2 - Math.PI * (0.5) / 3, -Math.PI/2 + Math.PI * (0.5) / 3);
            if (this.goal) this.goal = null;
        }
        if (this.bug.y + this.bug.size/2 > this.bug.bound_y + this.bug.bound_h) {
            //this.bug.angle = Math.PI / 2 + Math.PI * (0.5 - Math.random()) / 3;
            this.withinAngle(Math.PI / 2 - Math.PI * (0.5) / 3, Math.PI / 2 + Math.PI * (0.5) / 3);
            if (this.goal) this.goal = null;
        }
    }

    if (this.hiding && this.bug.x + this.bug.size/2 < 0) {
        this.speed = 0;
        this.bug.setDirection(this.bug.angle, 0);
    } else if (this.goal) {
        this.speed = 2.5;
        if ((this.bug.x-this.goal['x'])*(this.bug.x-this.goal['x']) + (this.bug.y-this.goal['y'])*(this.bug.y-this.goal['y']) <= 2*this.speed*this.speed) {
            this.goal = null;
            this.hiding = false;
            this.speed = 0;
            this.bug.setDirection(this.bug.angle, 0);
        } else {
            this.bug.setDirection(Math.atan2(this.bug.y - this.goal['y'], this.bug.x - this.goal['x']), this.speed);
        }
    } else if (!this.run_away && !this.hiding && this.bug.x - this.bug.size/2 > 0 && Math.random() < 0.025) {
        this.wait_until = Date.now() + 2000 + Math.random() * 5000;
        this.speed = 0;
        this.bug.setDirection(this.bug.angle, 0);
    } else if (Math.random() < 0.015) {
        this.da -= (0.5 - Math.random()) * 0.05;
    } else if (Math.random() < 0.015) {
        this.da += (0.5 - Math.random()) * 0.05;
    } else if (Math.random() < 0.015) {
        this.da = 0;
    }


    if (this.da > 0.5) {
        this.da = 0.5;
    }
    if (this.da < -0.5) {
        this.da = -0.5;
    }

    if (this.run_away) {
        this.speed = 5;
    }

    if (this.speed > 0) {
        this.bug.setDirection(this.bug.angle + this.da, this.speed);
    }


}

