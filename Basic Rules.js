var ExtendedMooreB4S4 = {
    ruleName: "5x5;B4S4",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -2; i <= 2; i++) {
            for (var j = -2; j <= 2; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = ExtendedMooreB4S4.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }
        if (nebCount == 4) {
            return 1;
        } else {
            return 0;
        }
    }
};
var SameDiagonals = {
    ruleName: "SameDiagonals",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        /*for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j * j + i * i === 2) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }*/
        var i=-1;
        var j=0;
        neighbors = neighbors.concat([{
            x: cell.x + j,
            y: cell.y + i,
            s: getCell(cellset, cell.x + j, cell.y + i)
        }]);
        i=1;
        j=0;
        neighbors = neighbors.concat([{
            x: cell.x + j,
            y: cell.y + i,
            s: getCell(cellset, cell.x + j, cell.y + i)
        }]);
        i=0;
        j=1;
        neighbors = neighbors.concat([{
            x: cell.x + j,
            y: cell.y + i,
            s: getCell(cellset, cell.x + j, cell.y + i)
        }]);
        i=0;
        j=-1;
        neighbors = neighbors.concat([{
            x: cell.x + j,
            y: cell.y + i,
            s: getCell(cellset, cell.x + j, cell.y + i)
        }]);
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = SameDiagonals.neighborsForCell(cell, cellset);
        var nebCount = 0;
        /*for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }*/
        var same1=Math.abs(nebs[0].s-nebs[1].s);
        var same2=Math.abs(nebs[2].s-nebs[3].s);
        if (same1===same2) {
            return 1;
        } else {
            return 0;
        }
    }
};
var ExtendedMooreB4S3 = {
    ruleName: "5x5;B4S3",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -2; i <= 2; i++) {
            for (var j = -2; j <= 2; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = ExtendedMooreB4S3.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount+=1;
                if (Math.max(Math.abs(nebs[i].x-cell.x),Math.abs(nebs[i].y-cell.y)) >1) {
                    //nebCount-=0.2;
                }
            }
        }
        if (nebCount+getCell(cellset, cell.x, cell.y)  ==4 ) {
            return 1;
        } else {
            return 0;
        }
    }
};
var Extended2MooreB6S4 = {
    ruleName: "7x7;B6S4",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -3; i <= 3; i++) {
            for (var j = -3; j <= 3; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = Extended2MooreB6S4.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }
        if (nebCount == 6||(nebCount == 4 && cell.s===1) ) {
            return 1;
        } else {
            return 0;
        }
    }
};
var ExtendedMooreB56S45 = {
    ruleName: "5x5;B56S45",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -2; i <= 2; i++) {
            for (var j = -2; j <= 2; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                                x: cell.x + j,
                                y: cell.y + i,
                                s: getCell(cellset, cell.x + j, cell.y + i)
                            }
                        ]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = ExtendedMooreB56S45.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s !== 0) {
                nebCount++;
            }
        }
        if (nebCount == 5||((nebCount == 8))|| ((nebCount == 3) && cell.s===1)) {
            return 1;
        } else {
            return 0;
        }
    }
};
var HexB4S4 = {
    ruleName: "Hex;B4S4",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -2; i <= 2; i++) {
            for (var j = -2; j <= 2; j++) {
                if (j * j + i * i > 0 && !(j == 2 && i == -2) && !(j == -2 && i == 2) && !(j == -2 && i == -1) && !(j == 2 && i == 1) && !(j == 1 && i == -2) && !(j == -1 && i == 2)) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = HexB4S4.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }
        if (nebCount == 7 || nebCount == 4) {
            return 1;
        } else {
            return 0;
        }
    }
};
var Life = {
    ruleName: "Life",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = Life.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }
        if (((nebCount == 3) && getCell(cellset, cell.x, cell.y) == 0) || ((nebCount == 2 || nebCount == 3) && getCell(cellset, cell.x, cell.y) == 1)) {
            return 1;
        } else {
            return 0;
        }
    }
};
var RPS = {
    ruleName: "Rock Paper Scissors",
    colors: ["red", "blue", "green"],
    states: 4,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = RPS.neighborsForCell(cell, cellset);
        var nebCount = 0;
        if (getCell(cellset, cell.x, cell.y) == 1) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j * j + i * i > 0) {
                        if (getCell(cellset, cell.x + j, cell.y + i) == 3) {
                            nebCount++;
                        }
                    }
                }
            }
            if (nebCount > 2) {
                return 3;
            }
            return 1;
        } else if (getCell(cellset, cell.x, cell.y) == 2) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j * j + i * i > 0) {
                        if (getCell(cellset, cell.x + j, cell.y + i) == 1) {
                            nebCount++;
                        }
                    }
                }
            }
            if (nebCount > 2) {
                return 1;
            }
            return 2;
        } else if (getCell(cellset, cell.x, cell.y) == 3) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j * j + i * i > 0) {
                        if (getCell(cellset, cell.x + j, cell.y + i) == 2) {
                            nebCount++;
                        }
                    }
                }
            }
            if (nebCount > 2) {
                return 2;
            }
            return 3;
        } else {
            return 0;
        }
    },
    random: function() {
        for (var i = 0; i < 100; i++) {
            for (var y = 0; y < 50; y++) {
                var gridX = i - 50;
                var gridY = y - 25;
                var state = Math.floor(Math.random() * 3) + 1;
                cells["POS" + gridX + "_" + gridY] = {
                    x: gridX,
                    y: gridY,
                    s: state
                };
            }
        }
    }
};
var Life2 = {
    ruleName: "Life2",
    colors: ["white", "red"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = Life2.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }
        if (((nebCount == 1) && (getCell(cellset, cell.x, cell.y) == 0 || getCell(cellset, cell.x, cell.y) == 3))) {
            return 1;
        } else if (getCell(cellset, cell.x, cell.y) == 1) {
            return 2;
        } else if ((getCell(cellset, cell.x, cell.y) == 2)) {
            return 0;
        } else {
            return 0;
        }
    }
};
var PersianCarpet = {
    ruleName: "Persian Carpet",
    colors: ["red", "#D09E26", "#75825C"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = PersianCarpet.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }
        if (nebCount == 2 && getCell(cellset, cell.x, cell.y) == 0) {
            return 1;
        } else if (nebCount == 3 && getCell(cellset, cell.x, cell.y) == 0) {
            return 2;
        } else if (nebCount == 4 && getCell(cellset, cell.x, cell.y) == 0) {
            return 3;
        } else {
            return 0;
        }
    }
};
var ColeRule = {
    ruleName: "ColeRule",
    colors: ["white", "#E91E63", "#FFEB3B", "#2196F3"],
    states: 5,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        if (getCell(cellset, cell.x, cell.y) < 3) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j * j + i * i > 0) {
                        neighbors = neighbors.concat([{
                            x: cell.x + j,
                            y: cell.y + i,
                            s: getCell(cellset, cell.x + j, cell.y + i)
                        }]);
                    }
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        if (getCell(cellset, cell.x, cell.y) == 0) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j * j + i * i == 1 && getCell(cellset, cell.x + j, cell.y + i) == 1 && getCell(cellset, cell.x + j * 2, cell.y + i * 2) < 4 && getCell(cellset, cell.x + j * 2, cell.y + i * 2) > 1) {
                        return 1;
                    }
                }
            }
            return 0;
        } else if (getCell(cellset, cell.x, cell.y) == 2) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j * j + i * i == 1 && getCell(cellset, cell.x + j, cell.y + i) == 1 && getCell(cellset, cell.x + j * 2, cell.y + i * 2) == 4) {
                        return 1;
                    }
                }
            }
            return 0;
        } else if (getCell(cellset, cell.x, cell.y) == 1) {
            return 2;
        } else if (getCell(cellset, cell.x, cell.y) == 3) {
            return 3;
        } else {
            return 4;
        }
    }
};
var ColeRule2 = {
    ruleName: "ColeRule2",
    colors: ["white", "#E91E63", "#FFEB3B", "#2196F3"],
    states: 5,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        if (getCell(cellset, cell.x, cell.y) < 3) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    //if (j * j + i * i > 0) {
                        neighbors = neighbors.concat([{
                            x: cell.x + j,
                            y: cell.y + i,
                            s: getCell(cellset, cell.x + j, cell.y + i)
                        }]);
                    //}
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        if (getCell(cellset, cell.x, cell.y) == 0) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j * j + i * i >0 && getCell(cellset, cell.x + j, cell.y + i) == 1 && ((j * j + i * i===1)?(getCell(cellset, cell.x + j * 2, cell.y + i * 2) < 4 &&getCell(cellset, cell.x + j * 2, cell.y + i * 2) > 1)&&
                        ((([0,1,3,4].indexOf(getCell(cellset, cell.x + j*2-i, cell.y + i*2-j)) >=0|| [4].indexOf(getCell(cellset, cell.x +i, cell.y +j)) >=0)&&([0,1,3,4].indexOf(getCell(cellset, cell.x + j*2+i, cell.y + i*2+j)) >=0|| [4].indexOf(getCell(cellset, cell.x -i, cell.y -j)) >=0))||getCell(cellset, cell.x + j*2, cell.y + i*2) == 30)&&
                        ((([4].indexOf(getCell(cellset, cell.x + j*2-i, cell.y + i*2-j)) >=0|| [0,1,3,4].indexOf(getCell(cellset, cell.x +i, cell.y +j)) >=0)&&([4].indexOf(getCell(cellset, cell.x + j*2+i, cell.y + i*2+j)) >=0|| [0,1,3,4].indexOf(getCell(cellset, cell.x -i, cell.y -j)) >=0))||getCell(cellset, cell.x + j*2, cell.y + i*2) == 30)&&
                        ((([0,3,4].indexOf(getCell(cellset, cell.x + j*1-i, cell.y + i*1-j)) >=0|| [0,3,4].indexOf(getCell(cellset, cell.x +j+i, cell.y +i+j)) >=0)||getCell(cellset, cell.x +j+i, cell.y +i+j)===getCell(cellset, cell.x +j-i, cell.y +i-j))||getCell(cellset, cell.x + j*2, cell.y + i*2) !== 2)
                        
                        
                    :(getCell(cellset, cell.x + j * 2, cell.y + i * 2) == 2||getCell(cellset, cell.x + j * 2, cell.y + i * 2) == 4&&
                        (([0,1,3,4].indexOf(getCell(cellset, cell.x + j*1, cell.y + i *0)) >=0|| [3].indexOf(getCell(cellset, cell.x + j*1, cell.y + i *2)) >=0)&&([0,1,3,4].indexOf(getCell(cellset, cell.x + j*0, cell.y + i *1))>=0 || [3].indexOf(getCell(cellset, cell.x + j*2, cell.y + i *1)) >=0))&&
                        (([3].indexOf(getCell(cellset, cell.x + j*1, cell.y + i *0)) >=0|| [0,1,3,4].indexOf(getCell(cellset, cell.x + j*1, cell.y + i *2)) >=0)&&([3].indexOf(getCell(cellset, cell.x + j*0, cell.y + i *1))>=0 || [0,1,3,4].indexOf(getCell(cellset, cell.x + j*2, cell.y + i *1)) >=0))
                    ))) {
                        return 1;
                    }
                }
            }
            return 0;
        } else if (getCell(cellset, cell.x, cell.y) == 2) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j * j + i * i >0 && getCell(cellset, cell.x + j, cell.y + i) == 1 && ((j * j + i * i===2)?(getCell(cellset, cell.x + j * 2, cell.y + i * 2) < 4 &&getCell(cellset, cell.x + j * 2, cell.y + i * 2) > 2):((getCell(cellset, cell.x + j * 2, cell.y + i * 2) == -100||getCell(cellset, cell.x + j * 2, cell.y + i * 2) == 4)))) {
                        return 1;
                    }
                }
            }
            return 0;
        } else if (getCell(cellset, cell.x, cell.y) == 1) {
            return 2;
        } else if (getCell(cellset, cell.x, cell.y) == 3) {
            return 3;
        } else {
            return 4;
        }
    }
};
var Caves = {
    ruleName: "Caves",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = Life.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }
        if (((nebCount > 4) && getCell(cellset, cell.x, cell.y) == 0) || ((nebCount > 3) && getCell(cellset, cell.x, cell.y) == 1)) {
            return 1;
        } else {
            return 0;
        }
    },
    random: function() {
        for (var i = 0; i < 100; i++) {
            for (var y = 0; y < 100; y++) {
                var gridX = i - 50;
                var gridY = y - 50;
                var state = 0;
                if (Math.random() > 0.5) {
                    state = 1;
                    cells["POS" + gridX + "_" + gridY] = {
                    x: gridX,
                    y: gridY,
                    s: state
                };
                }


            }
        }
    }
};
var infexpand = {
    ruleName: "Infinite Expander",
    colors: ["white"],
    states: 2,
    neighborsForCell: function(cell, cellset) {
        var neighbors = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j * j + i * i > 0) {
                    neighbors = neighbors.concat([{
                        x: cell.x + j,
                        y: cell.y + i,
                        s: getCell(cellset, cell.x + j, cell.y + i)
                    }]);
                }
            }
        }
        return neighbors;
    },
    calcCell: function(cell, cellset) {
        var nebs = Life.neighborsForCell(cell, cellset);
        var nebCount = 0;
        for (var i = 0; i < nebs.length; i++) {
            if (nebs[i].s != 0) {
                nebCount++;
            }
        }
        if (getCell(cellset, cell.x, cell.y) == 0) {
            return 1;
        } else {
            return 0;
        }
    }
};
