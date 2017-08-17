var r=8;
var period=4;
var oldTempCells=[];
function shift(){
var sx=-1;
var sy=-1;
var tempCells=[];
for(var x=0;x<r;x++){
tempCells[x]=[];
for(var y=0;y<r;y++){
tempCells[x][y]=getCell(cells,x-sx,y-sy);
}
}
var tempCellsBig=[];
for(var x=0;x<r+period*2;x++){
tempCellsBig[x]=[];
for(var y=0;y<r+period*2;y++){
tempCellsBig[x][y]=getCell(cells,x-sx-period,y-sy-period);
}
}
clearCells();
for(var x=0;x<r+period*2;x++){

for(var y=0;y<r+period*2;y++){
//if(cells[x][y]>0){
addCell(x-period,y-period,tempCellsBig[x][y]);
//}
}
}
oldTempCells=tempCells;

}

for(var x=0;x<r;x++){
oldTempCells[x]=[];
for(var y=0;y<r;y++){
oldTempCells[x][y]=getCell(cells,x,y);
}
}
function iterate(){

var tempCells=[];
for(var x=0;x<r;x++){
tempCells[x]=[];
for(var y=0;y<r;y++){
tempCells[x][y]=getCell(cells,x,y);
}
}
var isEmpty=true;
var diff=0;
var canChange=[];
for(var x=0;x<r;x++){

for(var y=0;y<r;y++){
if(tempCells[x][y]>0){
isEmpty=false;
}
diff+=tempCells[x][y]===oldTempCells[x][y]?0:1;

}
}
for(var x=0;x<r;x++){

for(var y=0;y<r;y++){
if((tempCells[x][y]!=oldTempCells[x][y])||isEmpty){
    if(Math.random()>0.75){
tempCells[x][y]=1-tempCells[x][y];//Math.floor(Math.random()*2);
    }
   }
}
}
for(var x=0;x<r;x++){

for(var y=0;y<r;y++){
//if(cells[x][y]>0){
addCell(x,y,tempCells[x][y]);
//}
}
}
for(var i=0;i<period;i++){
calc();
}
shift();
}
window.setInterval(iterate,0);