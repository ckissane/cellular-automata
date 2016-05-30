var bgWidth = w;
var bgHeight = h;
var running = false;
var cells = [];
$("#c").attr("width", w);
$("#c").attr("height", h);
var offsetX = 0;
var offsetY = 0;
var birth = [];
var survive = [];
var birth2 = [];
var survive2 = [];
var Rule = Life;
var generations = 0;
var c = document.getElementById("c");
var ctx = c.getContext("2d");
var transforms = [];
var mscrollX = 0;
var mscrollY = 0;
var scrollX = 0;
var scrollY = 0;
var zoom = Math.pow(1.5, -3);
var color = 0;
var inToggle = false;
var running = false;
var calcLoop = null;
var paintColor = 1;
var dragging = false;
var queryString = document.URL.indexOf('?')<0?"":document.URL.substring( document.URL.indexOf('?') + 1 );
var params = document.URL.indexOf('?')<0?{}:parseQueryString(queryString);
var clipboard=[];
var clipboardDim={w:0,h:0};
//console.log(params);
function parseQueryString( queryString ) {
    var params = {}, queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split("&");

    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
};
if(params.rule){
    if($('option[value="'+params.rule+'"]')[0]){

        $("#rules").val(params.rule);
    }else{
      params.rule="ExtendedMooreB4S4";
    }
}else{
  params.rule="ExtendedMooreB4S4";
}
function convertFromHash(hash){
  var largeNumber=0;
  var out="";
  var key=["0","1","2","3","4","5","6","7","8","9","A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"];
  var outKey=["0","1","2","3","4","5","6","7","8","9","|",",","-"];
  out=convertFromBaseToBase(hash,36,13);
  out=out.toUpperCase();
  out=out.replace(/A/g,"|");
  out=out.replace(/B/g,",");
  out=out.replace(/C/g,"-");
  return out;
}
function convertToHash(data){
  var largeNumber=0;
  var out="";
  var outKey=["0","1","2","3","4","5","6","7","8","9","A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"];
  var key=["0","1","2","3","4","5","6","7","8","9","|",",","-"];
  console.log("hashing:");
  console.log(data);
  var holder=0;
  for(var i = 0;i<data.length;i++) {
    holder=holder*key.length;
holder+=key.indexOf(data[i]);

  }

  /*data=data.toLowerCase();
  console.log(data);
  data=data.replace(/\|/g,"A");
  console.log(data);
  data=data.replace(/,/g,"B");
  console.log(data);
  data=data.replace(/\-/g,"C");
  console.log(data);*/


  out=convertFromBaseToBase(holder+"",10,36);

    console.log("out");
    console.log(out);
  console.log("end hashing");
  return out;
}
function makehash(){
  var cellArray = [];
  var saveString = "";
  for (var cell in cells) {

      if (cell.substr(0, 3) == "POS") {
          cellArray = cellArray.concat([cells[cell].x.toString(36) + "," + cells[cell].y.toString(36) + (cells[cell].s===1?"":"," + cells[cell].s.toString(36))]);
      }
  }
  cellArray.sort(compare);
  var cellsStringH=cellArray.join(";");
  var paramList=[];
  for(var i in params){
      if(params.hasOwnProperty(i)){
          if(i=="rule"){
              paramList.push("rule="+$("#rules").val());
          }else{
            if(i=="cells"){
                paramList.push("cells="+cellsStringH);
            }else{
              if(i=="base"){
                  paramList.push("base="+36);
              }else{
                  paramList.push(i+"="+params[i]);
              }
            }
          }
      }
  }
  if(!params.hasOwnProperty("cells")){
    paramList.push("cells="+cellsStringH);
  }
  if(!params.hasOwnProperty("rule")){
    paramList.push("rule="+$("#rules").val());
  }
  if(!params.hasOwnProperty("base")){
    paramList.push("base="+36);
  }


  var loc="?"+paramList.join("&");
  var current=document.location.href;
  var stateObj = {  current: loc };
    //window.location.search = loc;
  history.pushState(stateObj, "Super Cellular Automata", loc);
}
function convertFromBaseToBase(str, fromBase, toBase){
	var num = parseInt(str, fromBase);
    return num.toString(toBase);
}
//Convert number in string representation from base:from to base:to.
//Return result as a string

function loadSave(x) {
    clearCells();
    var cellList = x.split("|");
    for (var i = 0; i < cellList.length; i++) {
        var element = cellList[i].split(",");
        addCell(parseInt(element[0]), parseInt(element[1]), parseInt(element[2]));
      }
    }


function savePattern() {
    download();
}

function submitpat() {
    clearCells();
    var x = $("#inputTextToSave").val();
  //  console.log(convertToHash(x));
    //console.log(convertFromHash(convertToHash(x)));
    //x=convertFromHash(convertToHash(x));
    var cellList = x.split("|");
    for (var i = 0; i < cellList.length; i++) {
        var element = cellList[i].split(",");
        addCell(parseInt(element[0]), parseInt(element[1]), parseInt(element[2]));
    }
}

function MouseWheelHandler(e) {
    e.preventDefault();
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    var delta = 0;

    e.preventDefault();

    if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
        delta = -e.deltaY;
    } else if (e.wheelDelta) {
        delta = e.wheelDelta || -e.detail;
    }
    delta = Math.max(-1, Math.min(1, (delta)));
    //var mouseDiffX=mouseX - w / 2;
    //var mouseDiffY=mouseH - h / 2;
    //var gridX = (mouseX - w / 2 + scrollX*zoom) / 10 / zoom;
    //var gridY = (mouseY - h / 2 + scrollY*zoom) / 10 / zoom;
    //var oGridX = (0 + scrollX*zoom) / 10 / zoom;
    //var oGridY = (0 + scrollY*zoom) / 10 / zoom;
    //var oldZoom=zoom+0;
    var offsetX = e.pageX - 0 - document.body.scrollLeft - w / 2;
    var offsetY = e.pageY - 0 - document.body.scrollTop - h / 2;
    var oGridX = (mouseX - w / 2 + scrollX * zoom) / 10 / zoom;
    var oGridY = (mouseY - h / 2 + scrollY * zoom) / 10 / zoom;
    var pGridX = oGridX - (0 + scrollX * zoom) / 10 / zoom;
    var pGridY = oGridY - (0 + scrollY * zoom) / 10 / zoom;

    zoom = zoom * Math.pow(1.5, -delta);
    var newOffsetX = e.pageX - 0 - document.body.scrollLeft - w / 2;
    var newOffsetY = e.pageY - 0 - document.body.scrollTop - h / 2;
    if (zoom < Math.pow(1.5, -16)) {
        zoom = Math.pow(1.5, -16);
    }
    if (zoom > Math.pow(1.5, 6)) {
        zoom = Math.pow(1.5, 6);
    }
    var newGridX = (mouseX - w / 2 + scrollX * zoom) / 10 / zoom;
    var newGridY = (mouseY - h / 2 + scrollY * zoom) / 10 / zoom;
    var newPGridX = newGridX - (0 + scrollX * zoom) / 10 / zoom;
    var newPGridY = newGridY - (0 + scrollY * zoom) / 10 / zoom;
    scrollX += -(newPGridX - pGridX) * 10;
    scrollY += -(newPGridY - pGridY) * 10;
    //onwheel(e);
}

function onwheel(e) {
    var deltaY = 0;

    e.preventDefault();

    if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
        deltaY = e.deltaY;
    } else if (e.wheelDelta) {
        deltaY = -e.wheelDelta;
    }

    // As far as I know, there is no good cross-browser way to get the cursor position relative to the event target.
    // We have to calculate the target element's position relative to the document, and subtrack that from the
    // cursor's position relative to the document.
    var offsetX = e.pageX - 0 - document.body.scrollLeft - w / 2;
    var offsetY = e.pageY - 0 - document.body.scrollTop - h / 2;


    // Record the offset between the bg edge and cursor:
    var bgCursorX = offsetX - scrollX;
    var bgCursorY = offsetY - scrollY;

    // Use the previous offset to get the percent offset between the bg edge and cursor:
    var bgRatioX = bgCursorX / w / zoom;
    var bgRatioY = bgCursorY / h / zoom;

    // Update the bg size:
    if (deltaY < 0) {
        zoom *= 0.5;
        var scroll
    } else {
        zoom *= 2;
    }

    // Take the percent offset and apply it to the new size:
    scrollX = offsetX - (w * zoom * bgRatioX);
    scrollY = offsetY - (h * zoom * bgRatioY);

    // Prevent zooming out beyond the starting size
}
var myimage = document.getElementById("c");
if (myimage.addEventListener) {
    // IE9, Chrome, Safari, Opera
    myimage.addEventListener("mousewheel", MouseWheelHandler, false);
    // Firefox
    myimage.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}
// IE 6/7/8
else myimage.attachEvent("onmousewheel", MouseWheelHandler);

function updateRules() {
    stop();
    //$(".rule-script").html($(".rule-area").val());
    selectRule();


}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

if (Rule != eval($("#rules").val()) || $(".tool-item-state-selection").html() == "") {
        Rule = eval($("#rules").val());

        var brush = 0;
        $(".tool-item-state-selection").html("");
        var colors = ["black"].concat(Rule.colors);
        for (var i = 0; i < colors.length; i++) {
            //console.log(colors);
            var element=$(".tool-item-state-selection").append('<div class="state-column '+(i===1?"selected":"")+'" value="'+i+'" onclick="selectColor(' + i + ')"><div class="label">'+i+'</div><div class="label"><div style="height:12px;width:12px;display:inline-block;border:1px solid grey;box-sizing:border-box;background:'+ colors[i] +'"></div></div></div>');

        }
    }
//updateRules();
//$(".rule-script").html($(".rule-area").val());

//crazygro
// ?cells=0,0;0,1;1,0;1,1;2,0;2,1;-3,2;-2,2;-3,-1;-2,-1

//simple glider
// ?cells=0,0;0,1;0,2;0,3;2,-1;3,-1;2,4;3,4

// glider with extra something ?cells=0,0;0,1;1,0;1,1;2,0;2,1;-1,2;-2,2;-1,-1;-2,-1

//crazygro2
// ?cells=3,4;3,5;4,4;4,5;3,-7;3,-8;4,-7;4,-8

//crazygro3
//?cells=0,0;0,1;1,0;1,1;5,0;5,1;6,0;6,1;7,0;7,1;3,2;3,3;3,-1;3,-2

// pisser ?cells=0,0;0,1;0,2;0,3;2,-1;3,-1;2,4;4,4
// 4-cycle glider ?cells=0,0;0,1;0,2;0,3;2,-1;3,-1;2,4;4,4;4,0

// surprise surprise ?cells=0,0;0,1;0,2;0,3;2,-1;3,-1;2,4;4,4;4,1

// fertile crescent ?cells=0,0;0,1;0,2;0,3;2,-1;3,-1;2,4;4,4;5,4;5,3

// cross ?cells=0,0;0,1;1,0;1,1;2,0;2,1;3,-2;3,3;6,-2;6,3

// full monte ?cells=0,0;0,1;1,0;1,1;2,0;2,1;3,-2;3,3;6,-2;6,3;7,0;7,1;8,0;8,1;9,0;9,1

// fireworks ?cells=0,0;0,1;1,0;1,1;2,0;2,1;4,2;5,2;4,-1;5,-1

// hellfire ?cells=0,60;0,61;1,60;1,61;0,62;1,62;2,63;-1,63

// piss2 ?cells=0,60;0,61;1,60;1,61;0,62;1,62;2,63;-1,63;-1,66;0,66;1,66;2,66

// 12-step ?cells=0,60;0,61;1,60;1,61;0,62;1,62;3,63;-1,63;

// unexpected ?cells=0,60;0,61;1,60;1,61;0,62;1,62;3,63;-1,63;-1,64;-2,65;-2,66;-2,68

// stone1 ?cells=0,0;1,1;-1,1;-1,-1;1,-1

// stone2 ?cells=0,0;0,1;1,0;2,0;2,1

// make a stone ?cells=0,0;0,1;1,0;1,1;5,0;5,1;6,0;6,1;7,0;7,1;3,2;3,3

// germ ?cells=0,0;0,1;1,0;1,1;2,0;2,1;3,0;3,1

// germ2 ?cells=0,0;0,1;1,0;1,1;2,0;2,1;3,0;3,1;4,0;4,1;5,0;5,1

// Virus ?cells=0,0;0,1;1,0;1,1;2,0;2,1;6,0;6,1;4,0;4,1;5,0;5,1


//var x=0;for(var y=0;y<10;y++){for(var z=0;z<20;z++){x++;addCell(x,y,1)}}
//var x=6;for(var y=0;y<12;y++){x-=12;for(var z=0;z<12;z++){x++;if((Math.max(Math.abs(x),Math.abs(y-6))%2+2)%2==1){addCell(x,y,1)}}}
//var x=61;for(var y=0;y<=122;y++){x-=123;for(var z=0;z<=122;z++){x++;if((Math.max(Math.abs(x),Math.abs(y-61))%2+2)%2==1){addCell(x,y,1)}}}
//var x=101;for(var y=0;y<=202;y++){x-=202;for(var z=0;z<=202;z++){x++;if((Math.max(Math.abs(x),Math.abs(y-101))%3+3)%3==1){addCell(x,y,1)}}}
//var x=101;for(var y=0;y<=202;y++){x-=203;for(var z=0;z<=202;z++){x++;if((Math.sqrt(Math.pow(x,2)+Math.pow(y-101,2))%3+3)%3<1){addCell(x,y,1)}}}
var cellQ = params.cells;
if(cellQ!==undefined && cellQ!==null){
  var b=params.base;
  if(b===undefined){
b=10;
  }
var pairs = cellQ.split(";")
pairs.forEach(function(p) {
    var xy = p.split(",");
    var x = parseInt(xy[0],b);
    var y = parseInt(xy[1],b);
    var s=1;
    if(xy[2]!==undefined){
s=parseInt(xy[2],b);
    }
    addCell(x, y, s);
});
}

/*for(var i=-300;i<300;i++){
  addCell(i, 0, 1);
}*/

//randomCells();
//(".rule-script").html($(".rule-area").val());
window.setInterval(tick, 1);

/*$('#run-toggle').change(function() {
    if (!inToggle) {
        toggleCalc();
    }
});*/

function toggleCalc() {

    if (!running) {
        start();
    } else {
        stop();

    }
}

function stop() {
    inToggle = true;
    //$('#run-toggle').bootstrapToggle('off');
    $('.play-pause-button').removeClass("playing");
    if (!running) {

    } else {
        window.clearInterval(calcLoop);
        running = false;

    }
    inToggle = false;
}

function start() {
    inToggle = true;
    //$('#run-toggle').bootstrapToggle('on');
    $('.play-pause-button').addClass("playing");
    if (!running) {
        selectRule();
        //$(".rule-script").html($(".rule-area").val());
        calcLoop = window.setInterval(calc, 1);
        running = true;

    } else {


    }
    inToggle = false;
}

function calc() {
    generations++;
    //console.log(generations)
    $(".cell-gen").html(" Generation: " + generations);
    var oldSet = clone(cells);
    var toCalc = {};
    for (var cell in oldSet) {

        if (cell.substr(0, 3) == "POS") {

            if (toCalc.hasOwnProperty(cell)) {
                //toCalc[cell]=toCalc[cell]+1;
                toCalc[cell].alive = true;
                toCalc[cell].s = oldSet[cell].s;
            } else {
                toCalc[cell] = {
                    nebs: 0,
                    alive: true,
                    x: oldSet[cell].x,
                    y: oldSet[cell].y,
                    s: oldSet[cell].s
                };
            }
            var ns = Rule.neighborsForCell(oldSet[cell], oldSet);
            for (var m = 0; m < ns.length; m++) {

                if (toCalc["POS" + ns[m].x + "_" + ns[m].y] != null) {
                    toCalc["POS" + ns[m].x + "_" + ns[m].y].nebs = toCalc["POS" + ns[m].x + "_" + ns[m].y].nebs + 1;
                    //toCalc[cell].alive=true;
                } else {
                    toCalc["POS" + ns[m].x + "_" + ns[m].y] = {
                        nebs: 1,
                        alive: false,
                        x: ns[m].x,
                        y: ns[m].y //,
                        // s:oldSet[ns[m].x + "_" + ns[m].y].s
                    };
                }
            }

        }
    }


    for (var m in toCalc) {
        if (m.substr(0, 3) == "POS") {

            var value = Rule.calcCell(toCalc[m], oldSet);
            if (value != 0) {
                if(cells[m]!==undefined){
                    if(cells[m].s===value){
                    toCalc[m]=cells[m];
                }
                }
                cells[m] = toCalc[m];
                cells[m].s = value;
            } else {
                if (oldSet[m]) {
                    delete cells[m];
                }
            }
        }
    }
    countCells();

}

function compare(a, b) {
    if (a.x < b.x)
        return -1;
    if (a.x > b.x)
        return 1;
    if (a.y < b.y)
        return -1;
    if (a.y > b.y)
        return 1;
    return 0;
}

function getCell(grid, x, y) {
    if (grid["POS" + x + "_" + y] != null) {
        return grid["POS" + x + "_" + y].s;
    } else {
        return 0;
    }
}

function findGroups() {
    var cellArray = [];
    for (var cell in cells) {

        if (cell.substr(0, 3) == "POS") {
            cellArray = cellArray.concat([cell]);
            cells[cell].group = -1;
        }
    }
    var groups = [];
    var groupColors = [];
    for (var i = 0; i < cellArray.length; i++) {
        var currentCell = cellArray[i];
        if (cells[currentCell].group == -1) {
            groups[groups.length] = [currentCell];
            cells[currentCell].group = groups.length - 1;
            if(cells[currentCell].color===undefined){
                groupColors[cells[currentCell].group]= "hsl(" + cells[currentCell].group * 20 % 360 + ",100%,50%)";
            }else{
                groupColors[cells[currentCell].group]= cells[currentCell].color;
            }
        }

        cells[currentCell].color = groupColors[cells[currentCell].group];
        var ns = Rule.neighborsForCell(cells[currentCell], cells);
        for (var m = 0; m < ns.length; m++) {
            if (ns[m].s !== 0) {
                //cells["POS" + ns[m].x + "_" + ns[m].y].group = cells[currentCell].group;
                groupOf("POS" + ns[m].x + "_" + ns[m].y,groups,groupColors,cells[currentCell].group);


            }
        }

    }

}
function groupOf(currentCell,groups,groupColors,gro){
    if (cells[currentCell].group == -1) {
        cells[currentCell].group = gro;
        groups[cells[currentCell].group][groups[cells[currentCell].group].length] = currentCell;





        cells[currentCell].color = groupColors[cells[currentCell].group];
        var ns = Rule.neighborsForCell(cells[currentCell], cells);
        for (var m = 0; m < ns.length; m++) {
            if (ns[m].s !== 0) {
                //cells["POS" + ns[m].x + "_" + ns[m].y].group = cells[currentCell].group;
                groupOf("POS" + ns[m].x + "_" + ns[m].y,groups,groupColors,gro);
            }
        }
}
}

function tick() {
    selectRule();
    //$(".rule-script").html($(".rule-area").val());
    //eval($(".rule-area").val());

    $(".rule-name").html(Rule.ruleName);
    w = $(".canvas-cont").width();
    h = $(".canvas-cont").height();


    $("#c").attr("width", w);
    $("#c").attr("height", h);
    $(".toggle").attr("height", 30);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);
    ctx.strokeStyle = "black";
    var floorSX = scrollX - scrollX % 10;
    var floorSY = scrollY - scrollY % 10;
    if (zoom > Math.pow(1.5, -3)) {
        for (var x = -Math.ceil(w / zoom / 20) - 2; x < Math.ceil(w / zoom / 20) + 2; x++) {



            ctx.beginPath();
            ctx.lineWidth=1/zoom;
            ctx.moveTo((-scrollX) % 10 - 10 + x * 10, (-scrollY) % 10 - 10 - h / zoom / 2);
            ctx.lineTo((-scrollX) % 10 - 10 + x * 10, (-scrollY) % 10 - 10 + 10 + h / zoom / 2);
            ctx.strokeStyle = "grey";
            ctx.stroke();
        }
        for (var y = -Math.ceil(h / zoom / 20) - 2; y < Math.ceil(h / zoom / 20) + 2; y++) {
            ctx.beginPath();
            ctx.lineWidth=1/zoom;
            ctx.moveTo((-scrollX) % 10 - 10 - w / zoom / 2, (-scrollY) % 10 - 10 + y * 10);
            ctx.lineTo((-scrollX) % 10 - 10 + 10 + w / zoom / 2, (-scrollY) % 10 - 10 + y * 10);
            ctx.strokeStyle = "grey";
            ctx.stroke();

        }
    }
    if (zoom > Math.pow(1.5, -3) || true) {


            ctx.lineWidth=1/zoom;
            ctx.beginPath();
            ctx.strokeStyle = "#00ACDB";
            ctx.moveTo(-scrollX - 10 + 1 * 10, (-scrollY) % 10 - 10 - h / zoom / 2);
            ctx.lineTo(-scrollX - 10 + 1 * 10, (-scrollY) % 10 - 10 + 10 + h / zoom / 2);
            ctx.stroke();




            ctx.beginPath();
            ctx.strokeStyle = "#00ACDB";
            ctx.moveTo((-scrollX) % 10 - 10 - w / zoom / 2, -scrollY - 10 + 1 * 10);
            ctx.lineTo((-scrollX) % 10 - 10 + 10 + w / zoom / 2, -scrollY - 10 + 1 * 10);
            ctx.stroke();


    }
    countCells();
    //findGroups();
    for (var cell in cells) {
      if(zoom > Math.pow(1.5, -6)){
        if (cell.substr(0, 3) == "POS") {
            if (cells[cell].s != 2) {
                ctx.fillStyle = "red";
            } else {
                ctx.fillStyle = "blue";
            }
            ctx.fillStyle = Rule.colors[cells[cell].s - 1];
            var boxX = cells[cell].x * 10 - scrollX;
            var boxY = cells[cell].y * 10 - scrollY;
            ctx.beginPath();
            ctx.fillRect(boxX, boxY, 10, 10);
            ctx.fill();
        }
      }else{
        if (cell.substr(0, 3) == "POS") {
            if (cells[cell].s != 2) {
                ctx.fillStyle = "red";
            } else {
                ctx.fillStyle = "blue";
            }
            ctx.fillStyle = Rule.colors[cells[cell].s - 1];
            var boxX = cells[cell].x * 10 - scrollX;
            var boxY = cells[cell].y * 10 - scrollY;
            ctx.beginPath();
            ctx.fillRect(boxX, boxY, 1/zoom, 1/zoom);
            ctx.fill();
        }
      }
    }
    if(selection.on){
    var selectionOrdered={on:true,start:{x:Math.min(selection.start.x,selection.end.x),y:Math.min(selection.start.y,selection.end.y)},end:{x:Math.max(selection.start.x,selection.end.x),y:Math.max(selection.start.y,selection.end.y)}};
    var boxX = selectionOrdered.start.x * 10 - scrollX;
    var boxY =selectionOrdered.start.y * 10 - scrollY;
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,255,0,0.2)";
    ctx.fillRect(boxX, boxY, selectionOrdered.end.x * 10-selectionOrdered.start.x * 10+10, selectionOrdered.end.y * 10-selectionOrdered.start.y * 10+10);
    ctx.fill();

  }
  if(pasting){
    var gridX = Math.floor((mouseX - w / 2 + scrollX * zoom) / 10 / zoom);
    var gridY = Math.floor((mouseY - h / 2 + scrollY * zoom) / 10 / zoom);
    selection={on:true,start:{x:gridX,y:gridY},end:{x:gridX+clipboardDim.w-1,y:gridY+clipboardDim.h-1}};
    for(var i=0;i<clipboard.length;i++){
      var boxX = (clipboard[i].x+selectionOrdered.start.x) * 10 - scrollX;
      var boxY = (clipboard[i].y+selectionOrdered.start.y) * 10 - scrollY;
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,255,0,0.2)";
      ctx.fillRect(boxX, boxY, 10,10);
      ctx.fill();


    }
}
}

function clearCells() {
    stop();
    for (var cell in cells) {

        if (cell.substr(0, 3) == "POS") {
            delete cells[cell];
        }
    }
    generations=0;
}

function countCells() {
    var cellCount = 0;
    for (var cell in cells) {

        if (cell.substr(0, 3) == "POS") {
            cellCount++;
        }
    }
    $(".cell-num").html("cell count:" + cellCount);
}

function randomCells() {
    clearCells();
    if (Rule.random != null) {
        Rule.random();
    } else {
        for (var i = 0; i < 500+Math.random()*120; i++) {
          var gridX = Math.floor(Math.random() * 8)*105 +Math.floor(Math.random() * 6) - 105*4;
          var gridY = Math.floor(Math.random() * 8)*105 +Math.floor(Math.random() * 6) - 105*4;
            var state = Math.floor(Math.random() * 1) + 1
            cells["POS" + gridX + "_" + gridY] = {
                x: gridX,
                y: gridY,
                s: state
            };
        }
    }
}

function addCell(gridX, gridY, state) {
    cells["POS" + gridX + "_" + gridY] = {
        x: gridX,
        y: gridY,
        s: state
    };
}

function test() {
    $("#inputTextToSave")[0].value = $("#selector")[0].value;
    $(".fsc-EditableDocumentName").html = $("#selector")[0].innerHtml;
}
function loadAndOpenFile() {
    var fileToLoad = $("input#file-open-input")[0].files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        //$("#inputTextToSave")[0].value = textFromFileLoaded;
        clearCells();

        var x = textFromFileLoaded;//$("#inputTextToSave").val();
      //  console.log(convertToHash(x));
        //console.log(convertFromHash(convertToHash(x)));
        //x=convertFromHash(convertToHash(x));
        var cellList = x.split("|");
        for (var i = 0; i < cellList.length; i++) {
            var element = cellList[i].split(",");
            addCell(parseInt(element[0]), parseInt(element[1]), parseInt(element[2]));
        }

    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}
function loadFileAsText() {
    var fileToLoad = $(".fileupload input")[0].files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        $("#inputTextToSave")[0].value = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object" && obj[i] != null)
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}
function selectRule() {
    //$("#rule-area") = $("#rules").value;
    if (Rule != eval($("#rules").val()) || $(".tool-item-state-selection").html() == "") {
        Rule = eval($("#rules").val());

        var brush = 0;
        $(".tool-item-state-selection").html("");
        var colors = ["black"].concat(Rule.colors);
        for (var i = 0; i < colors.length; i++) {
            //console.log(colors);
            var element=$(".tool-item-state-selection").append('<div class="state-column '+(i===1?"selected":"")+'" value="'+i+'" onclick="selectColor(' + i + ')"><div class="label">'+i+'</div><div class="label"><div style="height:12px;width:12px;display:inline-block;border:1px solid grey;box-sizing:border-box;background:'+ colors[i] +'"></div></div></div>');

            //var element = $(".color-select").append("<div style=\'height:20px;width:20px;margin-left:10px;margin-top:5px;display:inline-block;background:" + colors[i] + "\' onclick=\'paintColor=" + i + "\'></div>");
        }
        paintColor=1;
    }
    if(params.rule!=$("#rules").val()){
      params.rule=$("#rules").val();
        var newSearch="";
        var paramList=[];
        for(var i in params){
            if(params.hasOwnProperty(i)){
                if(i=="rule"){
                    paramList.push("rule="+$("#rules").val());
                }else{
                    paramList.push(i+"="+params[i]);
                }
            }
        }
        if(!params.hasOwnProperty("rule")){
          paramList.push("rule="+$("#rules").val());
        }
        var loc="?"+paramList.join("&");
        var current=document.location.href;
        var stateObj = {  current: loc };
          //window.location.search = loc;
        history.pushState(stateObj, "Super Cellular Automata", loc);
        //history.pushState({}, loc, loc);
       // window. = paramList.join("&");
    }
}
function printCells(){
    var cellArray=[];
for (var cell in cells) {

        if (cell.substr(0, 3) == "POS") {
            cellArray.push([cells[cell].x,cells[cell].y,cells[cell].s]);
        }
    }
    console.log(cellArray);
}
function selectColor(cID){
    $(".state-column").removeClass("selected");
    $(".state-column[value="+cID+"]").addClass("selected");
    paintColor=cID;
}
function selectTool(tID){
    $(".tool-item-button").removeClass("selected");
    $(".tool-item-row .btn-default.selected").removeClass("selected");
    $(".tool-item-button[value="+tID+"]").addClass("selected");
    $(".tool-item-row .btn-default[value="+tID+"]").addClass("selected");
    toolMode=tID;
}
function cut(){
  stop();
  if(selection.on){
  var selectionOrdered={on:true,start:{x:Math.min(selection.start.x,selection.end.x),y:Math.min(selection.start.y,selection.end.y)},end:{x:Math.max(selection.start.x,selection.end.x),y:Math.max(selection.start.y,selection.end.y)}};
clipboardDim={w:selectionOrdered.end.x-selectionOrdered.start.x+1,h:selectionOrdered.end.y-selectionOrdered.start.y+1};
  clipboard=[];
  for(var x=selectionOrdered.start.x;x<=selectionOrdered.end.x;x++){

    for(var y=selectionOrdered.start.y;y<=selectionOrdered.end.y;y++){
  if(cells["POS" + x + "_" + y]){
    if(cells["POS" + x + "_" + y].s!==0){
      var c=cells["POS" + x + "_" + y];
      clipboard.push(c);
      clipboard[clipboard.length-1].x=clipboard[clipboard.length-1].x-selectionOrdered.start.x;
      clipboard[clipboard.length-1].y=clipboard[clipboard.length-1].y-selectionOrdered.start.y;
      delete cells["POS" + x + "_" + y];
    }
  }
    }
  }

}


}
function clearSelected(){
  stop();
  if(selection.on){
  var selectionOrdered={on:true,start:{x:Math.min(selection.start.x,selection.end.x),y:Math.min(selection.start.y,selection.end.y)},end:{x:Math.max(selection.start.x,selection.end.x),y:Math.max(selection.start.y,selection.end.y)}};

  for(var x=selectionOrdered.start.x;x<=selectionOrdered.end.x;x++){

    for(var y=selectionOrdered.start.y;y<=selectionOrdered.end.y;y++){
  if(cells["POS" + x + "_" + y]){
    if(cells["POS" + x + "_" + y].s!==0){
      var c=cells["POS" + x + "_" + y];

      delete cells["POS" + x + "_" + y];
    }
  }
    }
  }

  }

}
function copy(){
  stop();
  if(selection.on){
  var selectionOrdered={on:true,start:{x:Math.min(selection.start.x,selection.end.x),y:Math.min(selection.start.y,selection.end.y)},end:{x:Math.max(selection.start.x,selection.end.x),y:Math.max(selection.start.y,selection.end.y)}};
clipboardDim={w:selectionOrdered.end.x-selectionOrdered.start.x+1,h:selectionOrdered.end.y-selectionOrdered.start.y+1};
  clipboard=[];
  for(var x=selectionOrdered.start.x;x<=selectionOrdered.end.x;x++){

    for(var y=selectionOrdered.start.y;y<=selectionOrdered.end.y;y++){
  if(cells["POS" + x + "_" + y]){
    if(cells["POS" + x + "_" + y].s!==0){
      var c=cells["POS" + x + "_" + y];
      clipboard.push(clone(c));
      clipboard[clipboard.length-1].x=clipboard[clipboard.length-1].x-selectionOrdered.start.x;
      clipboard[clipboard.length-1].y=clipboard[clipboard.length-1].y-selectionOrdered.start.y;

    }
  }
    }
  }

}


}
function startPaste(){
  stop();
  if(!pasting){
  pasting=true;
}
}
function paste(){
  stop();
  pasting=false;
  var gridX = Math.floor((mouseX - w / 2 + scrollX * zoom) / 10 / zoom);
  var gridY = Math.floor((mouseY - h / 2 + scrollY * zoom) / 10 / zoom);
  selection={on:true,start:{x:gridX,y:gridY},end:{x:gridX+clipboardDim.w-1,y:gridY+clipboardDim.h-1}};
  if(selection.on){
  var selectionOrdered={on:true,start:{x:Math.min(selection.start.x,selection.end.x),y:Math.min(selection.start.y,selection.end.y)},end:{x:Math.max(selection.start.x,selection.end.x),y:Math.max(selection.start.y,selection.end.y)}};
/*  for(var x=selectionOrdered.start.x;x<=selectionOrdered.end.x;x++){
    for(var y=selectionOrdered.start.y;y<=selectionOrdered.end.y;y++){
  if(cells["POS" + x + "_" + y]){
    if(cells["POS" + x + "_" + y].s!==0){

      delete cells["POS" + x + "_" + y];
    }
  }
    }
  }
*/

  for(var i=0;i<clipboard.length;i++){



      //clipboard[i].x=clipboard[i].x+selectionOrdered.start.x;
      //clipboard[i].y=clipboard[i].y+selectionOrdered.start.y;
addCell(clipboard[i].x+selectionOrdered.start.x,clipboard[i].y+selectionOrdered.start.y,clipboard[i].s);
    }
  }
    }
    Mousetrap.bind(['command+c', 'ctrl+c'], function(e) {
        copy();
        return false;
    });
    Mousetrap.bind(['command+x', 'ctrl+x'], function(e) {
        cut();
        return false;
    });
    Mousetrap.bind(['command+v', 'ctrl+v'], function(e) {
        startPaste();
        return false;
    });
    Mousetrap.bind(['command+s', 'ctrl+s'], function(e) {
        savePattern();
        return false;
    });
    Mousetrap.bind(['command+o', 'ctrl+o'], function(e) {
        loadAndOpenFile();
        return false;
    });
    Mousetrap.bind('enter', function(e) {
        toggleCalc();
        return false;
    });
    Mousetrap.bind('space', function(e) {
        calc();
        return false;
    });
    Mousetrap.bind(['delete', 'backspace'], function(e) {
        clearSelected();
        return false;
    });
