import { Component, OnInit } from '@angular/core';

import * as SVG from 'svg.js';


import '../../assets/svg.pan-zoom.js';
import '../../assets/svg.draggy.js';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  svg: any;
  nodes: any;
  panZoom: any;
  panIsEnabled: boolean = true;
  isMouseDown = false;
  isMouseUp = true;
  newSeatGroup = false;
  seats: Array<any>;

  followEllipse: any;
  seatColor ='#FF5722';
  mouseX: any;
  mouseY: any;
  seatRadius: number = 50;
  seatGap: number = this.seatRadius / 2.5;
  mainGroup: any;
  prevEvent: any;
 

 
 
  prevX: any = 0;
  prevY: any = 0;
  constructor() {

  }

  ngOnInit() {
    this.createSvg();


    var ids = [8, 9, 10, 11, 12];

    // for(let i=0;i<ids.length;i++){
    //   let ellipse = this.nodes.group().ellipse(50, 50).attr({ fill: '#FF5722',cx:25+i*70,cy:50}).id(ids[i].toString()).draggy();
    //   this.panZoom = this.nodes.panZoom();
    // }
  }


  createSvg() {
    //create svg
    this.svg = SVG('editor-container').size(5000, 900).id('svg');
    this.nodes = this.svg.group();
    //styles for background
    document.getElementById('svg').style.backgroundColor = '#E0E0E0';
    document.getElementById('svg').style.backgroundImage = "url('/assets/images/grid17.png')";
    document.getElementById('svg').style.overflow = 'hidden';
    //create pan zoom object
    this.panZoom = this.nodes.panZoom();
    this.seats = [];


    this.followEllipse = this.nodes.ellipse(50, 50).attr({ fill: '#FF5722', cx: this.mouseX, cy: this.mouseY });

    this.togglePanZoom();
  }

  createElipse(event) {
    this.followEllipse.attr({ fill: '#FF5722', cx: event.x, cy: event.y });

    if (this.isMouseDown) {
      let y = 0;
      this.followEllipse.hide();

      if (this.seats.length > 0 && this.newSeatGroup)
      {
          this.seats = [];
      }


      if (this.getYOfAncorElement() == 0) {
        y = event.y;
      } 

      //draw the first element
      if (this.seats.length == 0) {
        this.seats[0] = [];
        this.drawSeatAt(event.x, event.y, this.seats[0]);
        this.prevEvent = event;
        this.newSeatGroup = false;
        return;
      }

      if(this.seats.length > 0)
      {
        let distanceX = this.getDistanceToAncor(event.x, parseInt(this.seats[0][this.seats[0].length-1].attr("cx")));
        let numberOfEligibleSeats = Math.floor(distanceX / (this.seatRadius+this.seatGap));
        
        if(this.isRightOfFirstElement(event)){
                  
                  
                  if(this.isMouseDirectionRight(event)){
                  let positions = this.getPositonsForSeats(parseInt(this.seats[0][this.seats[0].length-1].attr("cx")),(numberOfEligibleSeats-this.seats[0].length-1), 'r');

                    for(let j=0; j< this.seats.length;j++)
                    {
                        for(let i=0;i<positions.length;i++)
                        {
                          this.drawSeatAt(positions[i],parseInt(this.seats[j][0].attr("cy")),this.seats[j]);
                        }
                    }  
                 
                
                  }
                  else
                  {
                      for(let j=0; j< this.seats.length;j++)
                      {
                  
                          for(let i=this.seats[j].length-1;i>-1;i--)
                          {
                        
                            if(parseInt(this.seats[j][i].attr("cx"))>event.x)
                            {
                              this.removeSeatAt(this.seats[j],i);
                            }
                          }
                      }
                   }

        }
        else
        {
              if(this.isMouseDirectionRight(event)){
                    for(let j=0; j< this.seats.length;j++)
                    {                      
                        for(let i=this.seats[j].length-1;i>-1;i--)
                        {                         
                          if(parseInt(this.seats[j][i].attr("cx"))<event.x)
                          {
                            this.removeSeatAt(this.seats[j],i);
                          }
                        }
                    }
                  }
                  else
                  {

                    let positions = this.getPositonsForSeats(parseInt(this.seats[0][this.seats[0].length-1].attr("cx")),(numberOfEligibleSeats-this.seats[0].length-1),'l');

                    for(let j=0; j< this.seats.length;j++)
                    {
                        for(let i=0;i<positions.length;i++)
                        {
                          this.drawSeatAt(positions[i],parseInt(this.seats[j][0].attr("cy")),this.seats[j]);
                        }
                    }  
                
                 
                 }
        }


      }


    }

   this.prevEvent = event;
  }

  isMouseDirectionRight(event) : Boolean{
    console.log('prev ' + this.prevEvent.x  + ' current ' + event.x);
    if (this.prevEvent.x < event.x) {
     
      return true;
    }
  
    return false;
  }

  isMouseDirectionDown(event) : Boolean{
  if (this.prevEvent.y < event.y) {
    
      return true;
    }
   
    return false;

  }

  isRightOfFirstElement(event): Boolean {
    if (this.seats.length > 0 && event.x > this.seats[0][0].cx()) {
      return true;
    }
    return false;
  }

  isDownFromFirstElement(event): Boolean {
    if (this.seats.length > 0 && event.y > this.seats[0][0].cy()) {
      return true;
    }
    return false;
  }


  getDistanceToAncor(current, previous) {
    return Math.abs((current - previous));
  }


  removeSeatAt(array, currentelement) {

    if (array.length > 1) {
      array[currentelement].node.outerHTML = "";
      array.pop();
    }
  }

  getPositonsForSeats(startingPoint, numberOfSeats, direction) : Array<any>
  {
      let positions = new Array();
      let previousPosition = startingPoint;
      
      
          for(let i=0;i<numberOfSeats;i++)
          {
            let currentPosition = 0;
            if(direction == 'r'){
             currentPosition = previousPosition + this.seatRadius+ this.seatGap; 
            }
            else{
              currentPosition = previousPosition - this.seatRadius - this.seatGap; 
            }
            positions.push(currentPosition);
            previousPosition = currentPosition;
          }
      
      return positions;
  }
  
  
  drawSeatAt(x,y,array) {
    let ellipse;
    ellipse = this.nodes.ellipse(this.seatRadius, this.seatRadius).attr({ fill: this.seatColor, cx: x, cy: y }).draggy(); 
    array.push(ellipse);
  }


  getYOfAncorElement() {
    return this.seats.length > 0 ? this.seats[0] : 0;
  }

  onMouseButtonDown(event: MouseEvent) {
    this.isMouseDown = event.buttons === 1;
  }

  onMouseButtonUp(event: MouseEvent)
  {
    this.newSeatGroup = event.buttons === 1;  
    this.isMouseDown = false;
  }

  togglePanZoom() {
    if (this.panIsEnabled) {
      this.panZoom.togglePan(false);
      this.panIsEnabled = false;
      document.getElementById("svg").style.cursor = "initial";
    } else if (!this.panIsEnabled) {
      this.panZoom.togglePan(true);
      this.panIsEnabled = true;
      document.getElementById("svg").style.cursor = "move";
    }
  }

}
