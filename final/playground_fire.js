let buffer1;
let cooling;
let ystart=0;
let increment = 0.02;
let NOISEAMP = 10;
let FROST;

function setup(){
  FROST = color(50,120,180,100)
  createCanvas(640, 480);
  pixelDensity(1);
  buffer1=createGraphics(width, height);
  buffer1.background(0);
  initialize_cooling();
  background(0);
}

function draw(){
  background(0);
  fire();
  update_cooling();
  applycooling();
  //buffer2.loadPixels();
  image(buffer1, 0, 0);
}

function initialize_cooling(){
  cooling=[];
  for (let i=0; i<width; i++){
    for (let j=0; j<height; j++){
      cooling.push(0);
    }
  }
  let yoff=0.0;
  for (let y=0; y<height; y++){
    yoff+=increment;
    let xoff = 0.0;
    for (let x=0; x<width; x++){
      let idx=(x+y*width);
      xoff+=increment;
      let noiseVal=noise(xoff, yoff)*NOISEAMP;
      cooling[idx]=noiseVal;
    }
  }
  ystart=yoff;
}

function update_cooling(){
  for (let y=0; y<height-1; y++){
    for (let x=0; x<width; x++){
      let idx0=(x+y*width);
      let idx1=(x+(y+1)*width);
      cooling[idx0]=cooling[idx1];
    }
  }
  ystart+=increment;
  let xoff = 0.0;
  let y = height-1;
  for (let x=0; x<width; x++){
    let idx=(x+y*width);
    xoff+=increment;
    let noiseVal=noise(xoff, ystart)*NOISEAMP;
    cooling[idx]=noiseVal;
    cooling[idx+1]=noiseVal;
    cooling[idx+2]=noiseVal;
  }
}

function applycooling(){
  let buffer2=createGraphics(width, height);
  buffer2.background(0);
  buffer1.loadPixels();
  buffer2.loadPixels();
  for (let x=1; x<width-1; x++){
    for (let y=1; y<height-1; y++){
      let idx0=((x)+(y)*width)*4;
      let idx1=((x+1)+(y)*width)*4;
      let idx2=((x-1)+(y)*width)*4;
      let idx3=((x)+(y+1)*width)*4;
      let idx4=((x)+(y-1)*width)*4;
      let r=buffer1.pixels[idx1]+buffer1.pixels[idx2]+buffer1.pixels[idx3]+buffer1.pixels[idx4];
      let g=buffer1.pixels[idx1+1]+buffer1.pixels[idx2+1]+buffer1.pixels[idx3+1]+buffer1.pixels[idx4+1];
      let b=buffer1.pixels[idx1+2]+buffer1.pixels[idx2+2]+buffer1.pixels[idx3+2]+buffer1.pixels[idx4+2];
      buffer2.pixels[idx4]=r*0.25-cooling[idx0/4];
      buffer2.pixels[idx4+1]=g*0.25-cooling[idx0/4];
      buffer2.pixels[idx4+2]=b*0.25-cooling[idx0/4];
    }
  }
  // buffer1.updatePixels();
  buffer2.updatePixels();
  buffer1 = buffer2;
}

function fire(){

  // buffer1.stroke(100);
  // buffer1.strokeWeight(3);
  // buffer1.line(0, height/2, width, height/2);

  /*buffer1.loadPixels();
  for (let i=0; i<width; i++){
    let idx = (i + (height/2)*width)*4;
    buffer1.pixels[idx]=255;
  }*/
  buffer1.updatePixels();
  draw_line(0, height/2, width, height/2, 10, FROST);
}

function draw_line(x0, y0, x1, y1, l, color){
  let r=red(color), g=green(color), b=blue(color), a=alpha(color);
  for (let i=-l/2; i<l/2; i++){
    _draw_line(x0+i, y0+i, x1+i, y1+i, r, g, b, a);
  }
}

function _draw_line(x0, y0, x1, y1, r, g, b, a){
	let dx;
	let dy;
	let temp;
	let eps=1e-6;
	let derr;
	let err=0.0;
	let y;
	let x;
	let flag=1;
  buffer1.loadPixels();
  x0=int(x0);y0=int(y0);x1=int(x1);y1=int(y1);
	if (x0==x1) {
		if (y0<y1) {
			//GLCD_DrawVLine(x0, y0, (y1-y0));
      for (let y=y0; y<y1; y++){
        let idx=(x0+y*width)*4;
        buffer1.pixels[idx]=r;
        buffer1.pixels[idx+1]=g;
        buffer1.pixels[idx+2]=b;
        buffer1.pixels[idx+3]=a;
      }
      buffer1.updatePixels();
			return;
		}
		//GLCD_DrawVLine(x0, y1, (y0-y1));
    for (let y=y1; y<y0; y++){
      let idx=(x0+y*width)*4;
      buffer1.pixels[idx]=r;
      buffer1.pixels[idx+1]=g;
      buffer1.pixels[idx+2]=b;
      buffer1.pixels[idx+3]=a;
    }
    buffer1.updatePixels();
		return;
	}
	if (Math.abs(x0-x1)<Math.abs(y0-y1)){
		temp=x0; x0=y0; y0=temp;
		temp=x1; x1=y1; y1=temp;
		flag=0;
	}
	if (x0>x1){
		temp=x0;x0=x1;x1=temp;
		temp=y0;y0=y1;y1=temp;
	}
	dx=x1 - x0;
	dy=y1 - y0;
	derr=Math.abs(dy/dx);
	y=y0;
	for (x=x0; x<=x1; x++){
		if (flag) {
      let idx = (x+y*width)*4;
      buffer1.pixels[idx]=r;
      buffer1.pixels[idx+1]=g;
      buffer1.pixels[idx+2]=b;
      buffer1.pixels[idx+3]=a;
    }
		else {
      let idx = (y+x*width)*4;
      buffer1.pixels[idx]=r;
      buffer1.pixels[idx+1]=g;
      buffer1.pixels[idx+2]=b;
      buffer1.pixels[idx+3]=a;
    }
		err+=derr;
		if (err-0.5>=eps) {
			if (dy>0) y+=1;
			else if (dy<0) y-=1;
			err-=1.0;
		}
	}
  buffer1.updatePixels();
}
