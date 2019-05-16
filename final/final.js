// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */
"use strict";

let video;
let poseNet;
let poses = [];
let debugMode=false;
let SIN_ARRAY = [];
let COS_ARRAY = [];
let SINCOS_DETAIL = 2;

let eyes, face, leftArm, rightArm, leftLeg, rightLeg, body;


function setup() {

  for (let a = 0; a < 360; a+= 1/SINCOS_DETAIL){
    SIN_ARRAY.push(sin( radians(a) ));
    COS_ARRAY.push(cos( radians(a) ));
  }

  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
}

function draw() {
  //image(video, 0, 0, width, height);
  background(0);
  // We can call both functions to draw all keypoints and the skeletons
  processKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function processKeypoints()  {
  eyes=[];
  face=[];
  leftArm=[];
  rightArm=[];
  body=[];
  // Loop through all the poses detected
  // For each pose detected, loop through all the keypoints
  if (poses.length==0) return;
  let pose = poses[0].pose;
  for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > 0.1) {
      if (debugMode){
        push();
        fill(255,0,0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y,10,10);
        pop();
      }
      switch (j) {
        case 0:face.push(createVector(keypoint.position.x, keypoint.position.y));break;//nose
        case 1:eyes.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftEye
        case 2:eyes.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightEye
        case 3:face.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftEar
        case 4:face.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightEar
        case 5:body.push(createVector(keypoint.position.x, keypoint.position.y));//leftShoulder
        leftArm.push(createVector(keypoint.position.x, keypoint.position.y));
        break;
        case 6:body.push(createVector(keypoint.position.x, keypoint.position.y));//rightShoulder
        rightArm.push(createVector(keypoint.position.x, keypoint.position.y));
        break;
        case 7:leftArm.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftElbow
        case 8:rightArm.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightElbow
        case 9:leftArm.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftWrist
        case 10:rightArm.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightWrist
        case 11:body.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftHip
        case 12:body.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightHip
      }
    }
  }
}

function checkEyes(){
  return (eyes.length==2);
}
function checkFace(){
  return (face.length==3);
}
function checkLeftArm(){
  return (leftArm.length==3);
}
function checkRightArm(){
  return (rightArm.length==3);
}
function checkBody(){
  return (body.length==4);
}


// A function to draw the skeletons
function drawSkeleton() {
  if (checkFace()){
    drawFace();
  }
  if (checkEyes()){
    drawEyes();
  }
  if (checkLeftArm()){
    drawArm(leftArm);
  }
  if (checkRightArm()){
    drawArm(rightArm);
  }
  if (checkBody()){
    drawBody(body);
  }
}

function drawFace(){
  let dist1=p5.Vector.sub(face[0],face[1]).mag();
  let dist2=p5.Vector.sub(face[0],face[2]).mag();
  let radius=max(dist1, dist2);
  push();
  stroke(100);
  noFill();
  strokeWeight(3);
  circle(face[0].x, face[0].y, radius);
  pop();
}

function drawEyes(){
  let dist = p5.Vector.sub(eyes[0],eyes[1]).mag();
  let scl = map(dist, 0, width, 0.1, 1.3);
  drawFire(eyes[0].x, eyes[0].y, scl);
  drawFire(eyes[1].x, eyes[1].y, scl);
}

function drawArm(arm){
  for (let i=0; i<2; i++){
    let p1=arm[i];
    let p2=arm[i+1];
    push();
    stroke(100);
    strokeWeight(5);
    line(p1.x, p1.y, p2.x, p2.y);
    pop();
  }
}

function drawBody(body){
  //leftShoulder, rightShoulder, leftHip, rightHip
  let upMid = p5.Vector.add(body[0], body[1]).mult(0.5);
  let downMid = p5.Vector.add(body[2], body[3]).mult(0.5);
  push();
  stroke(100);
  strokeWeight(5);
  //line(body[0].x, body[0].y, body[2].x, body[2].y);
  //line(body[1].x, body[1].y, body[3].x, body[3].y);
  line(upMid.x, upMid.y, downMid.x, downMid.y);
  for (let i=0; i<4; i++){
    let posmidx=map(i, 0, 3, upMid.x, (downMid.x+upMid.x)*0.5);
    let posmidy=map(i, 0, 3, upMid.y, (downMid.y+upMid.y)*0.5);
    let posleftx=map(i, 0, 3, body[0].x, body[2].x);
    let poslefty=map(i, 0, 3, body[0].y, (body[0].y+body[2].y)*0.45);
    let posrightx=map(i, 0, 3, body[1].x, body[3].x);
    let posrighty=map(i, 0, 3, body[1].y, (body[1].y+body[3].y)*0.45);
    line(posmidx, posmidy, posleftx, poslefty);
    line(posmidx, posmidy, posrightx, posrighty);
  }

  pop();
}

function drawFire(_x, _y, _s){
  push();
  blendMode(ADD);
  translate(_x, _y+5);
  scale(_s);
  noStroke();
  let angle, amp, x, y;
  for (let i=0; i<10; i++){
    amp = 10+i;
    angle = frameCount * 0.01 * i;
    x = fastCos(angle) * amp;
    y = fastSin(angle) * amp;
    let s=100-10*i;
    fill(50, 120, 120, 200-20*i);
    ellipse(random(-2, 2)*i, -i*12, s, s);
  }
  pop();
}

function fastSin(angle){
  let deg = degrees(angle) % 360;
  let index = int(deg);
  return SIN_ARRAY[index];
}

function fastCos(angle){
  let deg = degrees(angle) % 360;
  let index = int(deg);
  return COS_ARRAY[index];
}
