/************* variables *************/
const _Rectangle = 0;
const _LShape = 1;
const _Special1 = 2;
const _Special2 = 3;
const _GridColorB = 190;
const _GridColorG = 240;
const _Unit = 20;
const _TrackerRect = 14;
const _DeltaLeft = 150;
const _v1 = 79.2, _v2 = 121.536; //for only LShape

let _DiffValue = _TrackerRect / 2;
let _ID = 0;
let _SelectedID = -1;
let _DeletedID = -1;
//data for rotate
let _TarX = [2], _TarY = [2];//no use
let _NewX = [2], _NewY = [2];//second elements are no usable
let _ImmutableX, _ImmutableY;
//objects
let _DeleteImg, _RotImg;
let _Edges = [];
//elements
let _CNV;
let _NewRectButton,
    _NewLShapeButton,
    _NewSpec1Button,
    _NewSpec2Button;
let _InputW, _InputH;
/************** system methods ***************/
function setup() {
  _CNV = createCanvas(_Unit*4*15, _Unit*4*8);
  _DeleteImg.resize(_Unit, _Unit);
  _RotImg.resize(_Unit, _Unit);
  pixelDensity(1);

  _NewRectButton = createImg("img/Rectangle.png");
  _NewRectButton.parent('addNewRect');
  _NewRectButton.mousePressed(_addNewRect);

  _NewLShapeButton = createImg('img/LShape.png');
  _NewLShapeButton.parent('addNewLShape');
  _NewLShapeButton.mousePressed(_addNewLShape);

  _NewSpec1Button = createImg('img/special1.png');
  _NewSpec1Button.parent('addNewSpec1');
  _NewSpec1Button.mousePressed(_addNewSpec1);

  _NewSpec2Button = createImg('img/special2.png');
  _NewSpec2Button.parent('addNewSpec2');
  _NewSpec2Button.mousePressed(_addNewSpec2);
  
  _InputW = createInput();
  _InputH = createInput();
  _hideInputs();
  // _showInputs();
}

function draw() {
  background(255);
  _drawGrid();
  for (i = 0; i < _Edges.length; i++) {
  	_Edges[i].show(mouseX,mouseY);
  }
}

function preload() {
  _DeleteImg = loadImage("img/delete.png");
  _RotImg = loadImage("img/rot.png");
}

function mousePressed() {
  let _selected = false;
  for (i = 0; i < _Edges.length; i++) {
    _Edges[i].pressed(mouseX,mouseY);
    // if(_Edges[i])
    //   _selected |= _Edges[i].gSelected;
  }
  for (i = 0; i < _Edges.length; i++) {
    if(_Edges[i])
      _selected |= _Edges[i].gSelected;
  }
  if(_SelectedID !== -1) {
    print("selected = " + _SelectedID);
    _Edges.filter(exceptID).forEach(_unSelectedItem);
  }
  if(!_selected){
    print("no selected");
    _unSelectedAll();
  }
}

function mouseReleased() {
  for (i = 0; i < _Edges.length; i++) {
    _Edges[i].notPressed();
  }
}

/************** filters & auxiliary functions ***************/
function exceptID(_item) {
  return _item.gID != _SelectedID;
}

function selectID(_item) {
  return _item.gID == _SelectedID;
}

function deleteID(_item) {
  return _item.gID != _DeletedID;
}

function _unSelectedItem(_item, _index) {
  _item.notSelected();
}

function _getRotatePoint(x0, y0, x1, y1, angle, index = 0) {
  let dx1 = x1 - x0;
  let dy1 = y1 - y0;
  let ang = Math.PI * angle / 180;
  let dx2 = dx1 * Math.cos(ang) - dy1 * Math.sin(ang);
  let dy2 = dx1 * Math.sin(ang) + dy1 * Math.cos(ang);
  _NewX[index] = dx2 + x0;
  _NewY[index] = dy2 + y0;
  // print("result : " + _NewX + "," + _NewY);
}

function _modifyW() {
  _Edges.filter(selectID)[0].setWidth(this.value());
}

function _modifyH() {
  _Edges.filter(selectID)[0].setHeight(this.value());
}

function _snapToGrid(_val) {
  return Math.round(_val / _Unit) * _Unit;
}
/************** user methods ***************/
function _drawGrid() {
  let counterX = 0;
  let counterY = 0;
  stroke(_GridColorB);
  // strokeWeight(1);
  rect(0, 0, width, height);
  for (var x = 0; x < width; x += _Unit) {
		for (var y = 0; y < height; y += _Unit) {
      if(counterX % 4 == 0 || counterY % 4 == 0)
      	stroke(_GridColorB);
      else
        stroke(_GridColorG);
			line(x, 0, x, height);
			line(0, y, width, y);
      counterY++;
		}
    counterX++;
	}
  stroke(_GridColorB);
  for (var x = 0; x < width; x += _Unit*4)
    line(x, 0, x, height);
	for (var y = 0; y < height; y += _Unit*4)
    line(0, y, width, y);
}

function _unSelectedAll() {
  for (i = 0; i < _Edges.length; i++) {
    _Edges[i].notSelected();
  }
  _SelectedID = -1;
  _hideInputs();
}

function _createEdge(_shape) {
  let id = _Edges.length;
  let x, y, w, h;
  x = y = _Unit * 4;
  switch(_shape) {
    case _Rectangle:
      w = _Unit * 8;
      h = _Unit * 4;
      break;
    case _LShape:
      x = _Unit * 12;
      y = _Unit * 12;
      w = h = _Unit * 12;
      break;
    case _Special1:
      x = _Unit * 8;
      y = _Unit * 8;
      w = h = _Unit * 4;
      break;
    case _Special2:
      x = _Unit * 4;
      y = _Unit * 4;
      w = _Unit * 5;
      h = _Unit * 4;
      break;
    }
  _Edges[id] = new Rectangle(x, y, w, h);
  _Edges[id].sShape = _shape;
  _Edges[id].sID = _ID;
  _ID++;
  print("shape = " + _Edges[id].gShape + ", ID = " + _Edges[id].gID);
}
function _hideInputs() {
  _InputW.hide();
  _InputH.hide();
  // _InputW.position(-_InputW.width-1, 0);
  // _InputH.position(-_InputH.width-1, 0);
  _InputW.attribute('value', 0);
  _InputH.attribute('value', 0);
}
function _showInputs() {
  _InputW.show();
  _InputH.show();
}
function _addNewRect() {
  _createEdge(_Rectangle);
}
function _addNewLShape() {
  _createEdge(_LShape);
}
function _addNewSpec1() {
  _createEdge(_Special1);
}
function _addNewSpec2() {
  _createEdge(_Special2);
}

function _deleteShape() {
  _Edges = _Edges.filter(exceptID);
  _DeletedID = -1;
}
/************* Object Oriented***************/
class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragging = false;
    this.selected = false;
    this.pressBody = false;
    this.shape = -1;
    this.ID = -1;
    this.rotAng = 0;
    this.accAng = 0;
    this.trackerID = 0;
    this.resizing = false;
  }

  get gShape() {
    return this.shape;
  }
  set sShape(_shape) {
    this.shape = _shape;
  }

  get gID() {
    return this.ID;
  }
  set sID(_id) {
    this.ID = _id;
  }

  get gSelected() {
    // return this.selected;
    // return this.dragging;
    // must use this member not this.selected
    return this.pressBody;
  }

  setWidth(_wid) {
    switch(this.shape){
      case _Rectangle:
        if(_wid < 60) {
          this.w = 60;
          return;
        }
        break;
      case _LShape:
        if(_wid < 200) {
          this.w = 200;
          return;
        }
        break;
    }
    this.w = _snapToGrid(_wid);
  }

  setHeight(_hei) {
    switch(this.shape){
      case _Rectangle:
        if(_hei < 60) {
          this.h = 60;
          return;
        }
        break;
      case _LShape:
        if(_hei < 200) {
          this.h = 200;
          return;
        }
        break;
    }
    this.h = _snapToGrid(_hei);
  }

  show(px, py) {
    if (this.resizing) {
      switch(this.trackerID) {
        case 1:
          this.x = _snapToGrid(px + this.offsetX);
          this.y = _snapToGrid(py + this.offsetY);
          this.w = Math.abs(_ImmutableX - this.x);
          this.h = Math.abs(_ImmutableY - this.y);
          break;
        case 2:
          if(this.shape == _Rectangle) {
            this.x = _snapToGrid(px + this.offsetX);
            this.w = Math.abs(_ImmutableX - this.x);
            this.h = _snapToGrid(Math.abs(_ImmutableY - py));
          }
          if(this.shape == _LShape) {
            switch(this.accAng){
              case 0:
                this.w = Math.abs(_ImmutableX - this.x);
                this.h = _snapToGrid(Math.abs(_ImmutableY - py));
                break;
              case 90:
              case 180:
                this.x = _snapToGrid(px);
                this.w = Math.abs(_ImmutableX - this.x);
                break;
              case 270:
                this.y = _snapToGrid(py);
                this.h = Math.abs(_ImmutableY - this.y);
                break;
            }
          }
          break;
        case 3:
          this.w = _snapToGrid(Math.abs(_ImmutableX - px));
          this.h = _snapToGrid(Math.abs(_ImmutableY - py));
          break;
        case 4:
          if(this.shape == _Rectangle) {
            this.y = _snapToGrid(py + this.offsetY);
            this.w = _snapToGrid(Math.abs(_ImmutableX - px));
            this.h = Math.abs(_ImmutableY - this.y);
          }
          if(this.shape == _LShape) {
            switch(this.accAng) {
              case 0:
                this.w = _snapToGrid(Math.abs(_ImmutableX - px));
                // this.h = Math.abs(_ImmutableY - this.y);
                break;
              case 90:
                let _py = _snapToGrid(py);
                this.h = Math.abs(_ImmutableY - _py);
                break;
              case 180:
                this.y = _snapToGrid(py);
                this.h = Math.abs(_ImmutableY - this.y);
                break;
              case 270:
                let _px = _snapToGrid(px);
                this.w = Math.abs(_ImmutableX - _px);
                break;
            }
          }
          break;
      }
      this.pressBody = false;
    }
    if (this.dragging) {
      this.x = px + this.offsetX;
      this.y = py + this.offsetY;
      this.x = _snapToGrid(this.x);
      this.y = _snapToGrid(this.y);
      this.pressBody = false;
    }
    let x0 = this.x, y0 = this.y;
    let wid = this.w, hei = this.h;
    strokeWeight(2);
    if (this.selected){
      stroke(50, 50, 255);
    } else {
      stroke(60);
    }

    //for LShape
    let mX, mY;
    if(this.shape == _LShape){
      switch(this.accAng) {
        case 0:
          mX = this.x; mY = this.y;
          break;
        case 90:
          mX = this.x + this.w; mY = this.y;
          break;
        case 180:
          mX = this.x + this.w; mY = this.y + this.h;
          break;
        case 270:
          mX = this.x; mY = this.y + this.h;
          break;
      }
    }
    if(this.rotAng != 0){
      this.rotate();
      mX = _NewX[0];
      mY = _NewY[0];
      this.pressBody = false;
    }

    /*****
    0   :  1,  1
    90  : -1,  1
    180 : -1, -1
    270 :  1, -1
    *****/
    noFill();
    switch(this.shape) {
      case _LShape:
        let vecX,vecY;
        switch(this.accAng) {
          case 0:
            vecX = 1; vecY = 1;
            break;
          case 90:
            vecX = -1; vecY = 1;
            break;
          case 180:
            vecX = -1; vecY = -1;
            break;
          case 270:
            vecX = 1; vecY = -1;
            break;
        }

        line(mX, mY, mX+(this.w*vecX), mY);
        line(mX, mY, mX, mY+(this.h*vecY));

        line(mX+(_v1*vecX), mY+(_v2*vecY), mX+(_v2*vecX), mY+(_v1*vecY));
        line(mX+(_v1*vecX), mY+(_v2*vecY), mX+(_v1*vecX), mY+(this.h*vecY));
        line(mX+(_v2*vecX), mY+(_v1*vecY), mX+(this.w*vecX), mY+(_v1*vecY));

        line(mX, mY+(this.h*vecY), mX+(_v1*vecX), mY+(this.h*vecY));
        line(mX+(this.w*vecX), mY, mX+(this.w*vecX), mY+(_v1*vecY));

        break;
      case _Rectangle:
        rect(x0, y0, wid, hei);
        break;
      case _Special1:
        rect(x0, y0, wid, hei);
        switch(this.accAng) {
          case 0:
            line(x0, y0+60, x0+wid, y0+60);
            circle(x0+23, y0+16, 22); circle(x0+57, y0+16, 22);
            circle(x0+23, y0+44, 22); circle(x0+57, y0+44, 22);
            break;
          case 90:
            line(x0+20, y0, x0+20, y0+hei);
            circle(x0+36, y0+23, 22); circle(x0+36, y0+57, 22);
            circle(x0+64, y0+23, 22); circle(x0+64, y0+57, 22);
            break;
          case 180:
            line(x0, y0+20, x0+wid, y0+20);
            circle(x0+23, y0+36, 22); circle(x0+57, y0+36, 22);
            circle(x0+23, y0+64, 22); circle(x0+57, y0+64, 22);
            break;
          case 270:
            line(x0+60, y0, x0+60, y0+hei);
            circle(x0+16, y0+23, 22); circle(x0+16, y0+57, 22);
            circle(x0+44, y0+23, 22); circle(x0+44, y0+57, 22);
            break;
        }
        break;
      case _Special2:
        rect(x0, y0, wid, hei);
        switch(this.accAng) {
          case 0:
            rect(x0+10, y0+20, wid-20, hei-30, 5);
            circle(x0+wid/2, y0+hei/5*3+5, 22);
            break;
          case 90:
            rect(x0+10, y0+10, wid-30, hei-20, 5);
            circle(x0+wid/5*2-5, y0+hei/2, 22);
            break;
          case 180:
            rect(x0+10, y0+10, wid-20, hei-30, 5);
            circle(x0+wid/2, y0+hei/5*2-5, 22);
            break;
          case 270:
            rect(x0+20, y0+10, wid-30, hei-20, 5);
            circle(x0+wid/5*3+5, y0+hei/2, 22);
            break;
        }
        break;
    }
    if (this.selected) {
      strokeWeight(1);
      stroke(0);
      fill(255);
      _showInputs();
      switch(this.shape){
        case _Rectangle:
          rect(this.x-_DiffValue, this.y-_DiffValue, _TrackerRect, _TrackerRect);//1
          rect(this.x-_DiffValue, this.y+this.h-_DiffValue, _TrackerRect, _TrackerRect);//2
          rect(this.x+this.w-_DiffValue, this.y+this.h-_DiffValue, _TrackerRect, _TrackerRect);//3
          rect(this.x+this.w-_DiffValue, this.y-_DiffValue, _TrackerRect, _TrackerRect);//4
          //input width
          _InputW.position(_DeltaLeft+this.x+this.w/2-_InputW.width/2, this.y-_InputW.height-_Unit/2);
          _InputW.value(this.w);
          // _InputW.attribute('value', this.w);
          _InputW.input(_modifyW);
          //input height
          _InputH.position(_DeltaLeft+this.x-_InputH.width-_Unit/2, this.y+this.h/2-_InputH.height/2);
          _InputH.value(this.h);
          _InputH.input(_modifyH);
          break;
        case _LShape:
          switch(this.accAng) {
            case 0:
              rect(this.x+_v1/2-_DiffValue, this.y+this.h-_DiffValue, _TrackerRect, _TrackerRect);//1
              rect(this.x+this.w-_DiffValue, this.y+_v1/2-_DiffValue, _TrackerRect, _TrackerRect);//3
              break;
            case 90:
              rect(this.x-_DiffValue, this.y+_v1/2-_DiffValue, _TrackerRect, _TrackerRect);//1
              rect(this.x+this.w-_v1/2-_DiffValue, this.y+this.h-_DiffValue, _TrackerRect, _TrackerRect);//3
              break;
            case 180:
              rect(this.x-_DiffValue, this.y+this.h-_v1/2-_DiffValue, _TrackerRect, _TrackerRect);//1
              rect(this.x+this.w-_v1/2-_DiffValue, this.y-_DiffValue, _TrackerRect, _TrackerRect);//3
              break;
            case 270:
              rect(this.x+_v1/2-_DiffValue, this.y-_DiffValue, _TrackerRect, _TrackerRect);//1
              rect(this.x+this.w-_DiffValue, this.y+this.h-_v1/2-_DiffValue, _TrackerRect, _TrackerRect);//3
              break;
          }
          //input width
          _InputW.position(_DeltaLeft+this.x+this.w/2-_InputW.width/2, this.y-_InputW.height-_Unit/2);
          _InputW.value(this.w);
          _InputW.input(_modifyW);
          //input height
          _InputH.position(_DeltaLeft+this.x-_InputH.width-_Unit/2, this.y+this.h/2-_InputH.height/2);
          _InputH.value(this.h);
          _InputH.input(_modifyH);
          break;
        default:
          _hideInputs();
          break;  
      }
      image(_RotImg, x0+wid+_Unit/2, y0+hei+_Unit/2);//rotate button
      image(_DeleteImg, x0+wid+_Unit/2, y0-_Unit/2*3);//remove button
    }
  }

  rotate() {
    _hideInputs();
    let x0, y0, x1, y1;
    x0 = this.x + this.w/2;
    y0 = this.y + this.h/2;
    switch(this.shape) {
      case _Rectangle:
        x1 = this.x;
        y1 = this.y + this.h;
        _getRotatePoint(x0, y0, x1, y1, this.rotAng);
        this.x = _NewX[0];
        this.y = _NewY[0];
        break;
      case _LShape:
        switch(this.accAng-90) {
          case 0:
            x1 = this.x; y1 = this.y;
            break;
          case 90:
            x1 = this.x + this.w; y1 = this.y;
            break;
          case 180:
            x1 = this.x + this.w; y1 = this.y + this.h;
            break;
          case 270:
            x1 = this.x; y1 = this.y + this.h;
            break;
        }
        _getRotatePoint(x0, y0, x1, y1, this.rotAng);
        break;
    }
    let temp = this.w; this.w = this.h; this.h = temp;
    this.rotAng = 0;
  }

  pressed(px, py) {
    //pressed remove button
    if(this.overDelBtn(px, py)){
      print("remove this shape");
      _DeletedID = this.ID;
      _deleteShape();
      return;
    }
    //pressed rotate button
    if(this.overRotBtn(px, py)) {
      print("clicked RotBtn");
      this.pressBody = true;
      this.selected = true;
      this.resizing = false;
      _SelectedID = this.ID;
      this.rotAng += 90;
      this.accAng += 90;
      this.accAng %= 360;
      return;
    }
    //edit input W & H
    if(this.overInputW(px, py) || this.overInputH(px, py)) {
      print("clicked InputW or  InputH");
      this.pressBody = true;
      this.selected = true;
      this.resizing = false;
      _SelectedID = this.ID;
      return;
    }
    //drag tracker 1~4
    if(this.overTracker1(px, py)) {
      this.resizing = true; this.pressBody = true; this.selected = true; _SelectedID = this.ID;
      this.trackerID = 1;
      _ImmutableX = this.x + this.w;
      _ImmutableY = this.y + this.h;
      this.offsetX = this.x - px; this.offsetY = this.y - py;
      return;
    }
    if(this.overTracker2(px, py)) {
      this.resizing = true; this.pressBody = true; this.selected = true; _SelectedID = this.ID;
      this.trackerID = 2;
      _ImmutableX = this.x + this.w;
      _ImmutableY = this.y;
      this.offsetX = this.x - px; this.offsetY = this.y + this.h - py;
      if(this.shape == _LShape && this.accAng == 270) {
        _ImmutableY += this.h;
      }
      return;
    }
    if(this.overTracker3(px, py)) {
      this.resizing = true; this.pressBody = true; this.selected = true; _SelectedID = this.ID;
      this.trackerID = 3;
      _ImmutableX = this.x;
      _ImmutableY = this.y;
      this.offsetX = this.x + this.w - px; this.offsetY = this.y + this.h - py;
      return;
    }
    if(this.overTracker4(px, py)) {
      this.resizing = true; this.pressBody = true; this.selected = true; _SelectedID = this.ID;
      this.trackerID = 4;
      _ImmutableX = this.x;
      _ImmutableY = this.y + this.h;
      this.offsetX = this.x + this.w - px; this.offsetY = this.y - py;
      if(this.shape == _LShape){
        if(this.accAng == 90 || this.accAng == 270)
          _ImmutableY = this.y;
      }
      return;
    }
    //pressed body except special area like rotate || remote button
    if (this.overBody(px, py)) {
      print("clicked on rect");
      this.pressBody = true;
      this.dragging = true;
      this.selected = true;
      this.resizing = false;
      _SelectedID = this.ID;
      this.offsetX = this.x - px;
      this.offsetY = this.y - py;
    }
  }
  overTracker1(px, py) {
    if(this.shape == _LShape) return false;
    if (px > this.x-_DiffValue && px < this.x-_DiffValue + _TrackerRect && 
      py > this.y-_DiffValue && py < this.y-_DiffValue+_TrackerRect) {
      return true;
    }
    return false;
  }
  overTracker2(px, py) {
    if(this.shape == _Rectangle){
      if (px > this.x-_DiffValue && px < this.x-_DiffValue + _TrackerRect && 
        py > this.y+this.h-_DiffValue && py < this.y+this.h-_DiffValue+_TrackerRect) {
        return true;
      }
      return false;
    }
    if(this.shape == _LShape) {
      switch(this.accAng) {
        case 0:
          if (px > this.x+_v1/2-_DiffValue && px < this.x+_v1/2-_DiffValue + _TrackerRect && 
              py > this.y+this.h-_DiffValue && py < this.y+this.h-_DiffValue+_TrackerRect) {
            return true;
          }
          return false;
        break;
        case 90:
          if (px > this.x-_DiffValue && px < this.x-_DiffValue + _TrackerRect && 
              py > this.y+_v1/2-_DiffValue && py < this.y+_v1/2-_DiffValue+_TrackerRect) {
            return true;
          }
          return false;
        break;
        case 180:
          if (px > this.x-_DiffValue && px < this.x-_DiffValue + _TrackerRect && 
              py > this.y+this.h-_v1/2-_DiffValue && py < this.y+this.h-_v1/2-_DiffValue+_TrackerRect) {
            return true;
          }
          return false;
        break;
        case 270:
          if (px > this.x+_v1/2-_DiffValue && px < this.x+_v1/2-_DiffValue + _TrackerRect && 
              py > this.y-_DiffValue && py < this.y-_DiffValue+_TrackerRect) {
            return true;
          }
          return false;
        break;
      }
    }
  }
  overTracker3(px, py) {
    if(this.shape == _LShape) return false;
    if (px > this.x+this.w-_DiffValue && px < this.x+this.w-_DiffValue + _TrackerRect && 
      py > this.y+this.h-_DiffValue && py < this.y+this.h-_DiffValue+_TrackerRect) {
      return true;
    }
    return false;
  }
  overTracker4(px, py) {
    if(this.shape == _Rectangle) {
      if (px > this.x+this.w-_DiffValue && px < this.x+this.w-_DiffValue + _TrackerRect && 
         py > this.y-_DiffValue && py < this.y-_DiffValue+_TrackerRect) {
        return true;
      }
      return false;
    }
    if(this.shape == _LShape) {
      switch(this.accAng) {
        case 0:
          if (px > this.x+this.w-_DiffValue && px < this.x+this.w-_DiffValue + _TrackerRect && 
             py > this.y+_v1/2-_DiffValue && py < this.y+_v1/2-_DiffValue+_TrackerRect) {
            return true;
          }
          return false;
        break;
        case 90:
          if (px > this.x+this.w-_v1/2-_DiffValue && px < this.x+this.w-_v1/2-_DiffValue + _TrackerRect && 
              py > this.y+this.h-_DiffValue && py < this.y+this.h-_DiffValue+_TrackerRect) {
            return true;
          }
          return false;
        break;
        case 180:
          if (px > this.x+this.w-_v1/2-_DiffValue && px < this.x+this.w-_v1/2-_DiffValue + _TrackerRect && 
              py > this.y-_DiffValue && py < this.y-_DiffValue+_TrackerRect) {
            return true;
          }
          return false;
        break;
        case 270:
          if (px > this.x+this.w-_DiffValue && this.x+this.w-_DiffValue + _TrackerRect && 
              py > this.y+this.h-_v1/2-_DiffValue && py < this.y+this.h-_v1/2-_DiffValue+_TrackerRect) {
            return true;
          }
          return false;
        break;
      }
    }
  }
  overBody(px, py) {
    if (px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h) {
      return true;
    }
    return false;
  }
  overDelBtn(px, py) {
    if (px > this.x+this.w+_Unit/2 && px < this.x+this.w+_Unit/2+_Unit &&
        py > this.y-_Unit/2*3 && py < this.y-_Unit/2) {
      return true;
    }
    return false;
  }
  overRotBtn(px, py) {
    if (px > this.x+this.w+_Unit/2 && px < this.x+this.w+_Unit/2+_Unit &&
        py > this.y+this.h+_Unit/2 && py < this.y+this.h+_Unit/2+_Unit) {
      return true;
    }
    return false;
  }
  overInputW(px, py) {
    if (px > this.x+this.w/2-_InputW.width/2 && px < this.x+this.w/2+_InputW.width/2 &&
        py > this.y-_InputW.height-_Unit/2 && py < this.y-_Unit/2) {
      return true;
    }
    return false;
  }
  overInputH(px, py) {
    if (px > this.x-_InputH.width-_Unit/2 && px < this.x-_Unit/2 &&
        py > this.y+this.h/2-_InputH.height/2 && py < this.y+this.h/2+_InputH.height/2) {
      return true;
    }
    return false;
  }
  notSelected(px, py) {
    print("shape was unselected");
    this.selected = false;
  }
  notPressed(px, py) {
    print("mouse was released");
    this.dragging = false;
    this.resizing = false;
    this.trackerID = 0;
  }
}
