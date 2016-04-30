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
var queryString = document.URL.substring( document.URL.indexOf('?') + 1 );
var params = parseQueryString(queryString);
console.log(params);
if(params.rule){
    if($('option[value="'+params.rule+'"]')[0]){
        $("#rules").val(params.rule);
    }
}
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
function savePattern() {
    download();
}

function submitpat() {
    clearCells();
    var x = $("#inputTextToSave").val();
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


updateRules();
//$(".rule-script").html($(".rule-area").val());
/*addCell(0, 0, 1);
addCell(1, 0, 1);
addCell(0, 1, 1);
addCell(1, 1, 1);
addCell(0, 2, 2);
addCell(1, 2, 2);
addCell(-1, 4, 1);
addCell(2, 4, 1);
addCell(-1, 5, 1);
addCell(2, 5, 1);*/

/*for(var i=-300;i<300;i++){
  addCell(i, 0, 1);
}*/

//randomCells();
//(".rule-script").html($(".rule-area").val());
window.setInterval(tick, 1);

$('#run-toggle').change(function() {
    if (!inToggle) {
        toggleCalc();
    }
});

function toggleCalc() {

    if (!running) {
        start();
    } else {
        stop();

    }
}

function stop() {
    inToggle = true;
    $('#run-toggle').bootstrapToggle('off');
    if (!running) {

    } else {
        window.clearInterval(calcLoop);
        running = false;

    }
    inToggle = false;
}

function start() {
    inToggle = true;
    $('#run-toggle').bootstrapToggle('on');
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
    console.log(generations)
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
            if (x != 1) {
                ctx.strokeStyle = "white";
            } else {
                ctx.strokeStyle = "white";
            }
            ctx.beginPath();
            ctx.moveTo((-scrollX) % 10 - 10 + x * 10, (-scrollY) % 10 - 10 - h / zoom / 2);
            ctx.lineTo((-scrollX) % 10 - 10 + x * 10, (-scrollY) % 10 - 10 + 10 + h / zoom / 2);
            ctx.stroke();
        }
        for (var y = -Math.ceil(h / zoom / 20) - 2; y < Math.ceil(h / zoom / 20) + 2; y++) {
            ctx.beginPath();
            ctx.moveTo((-scrollX) % 10 - 10 - w / zoom / 2, (-scrollY) % 10 - 10 + y * 10);
            ctx.lineTo((-scrollX) % 10 - 10 + 10 + w / zoom / 2, (-scrollY) % 10 - 10 + y * 10);
            ctx.stroke();
            if (y != 0) {
                ctx.strokeStyle = "white";
            } else {
                ctx.strokeStyle = "white";
            }
        }
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
}

function clearCells() {
    stop();
    for (var cell in cells) {

        if (cell.substr(0, 3) == "POS") {
            delete cells[cell];
        }
    }
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
          var gridX = Math.floor(Math.random() * 8)*55 +Math.floor(Math.random() * 6) - 55*4;
          var gridY = Math.floor(Math.random() * 8)*55 +Math.floor(Math.random() * 6) - 55*4;
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

function loadFileAsText() {
    var fileToLoad = $(".fileupload input")[0].files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        $("#inputTextToSave")[0].value = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}


function selectRule() {
    //$("#rule-area") = $("#rules").value;
    if (Rule != eval($("#rules").val()) || $(".color-select").html() == "") {
        Rule = eval($("#rules").val());
        var brush = 0;
        $(".color-select").html("");
        var colors = ["black"].concat(Rule.colors);
        for (var i = 0; i < colors.length; i++) {
            console.log(colors);
            var element = $(".color-select").append("<div style=\'height:20px;width:20px;margin-left:10px;margin-top:5px;display:inline-block;background:" + colors[i] + "\' onclick=\'paintColor=" + i + "\'></div>");
        }
    }
}
