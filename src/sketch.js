let faces;
let projectionMatrix;

let camZ;

let angleX;

function setup() {
  createCanvas(400, 400);
  noFill();

  
  // Create the vertices
  let vertices = [];
  
  vertices.push([-50.0, -50.0,  50.0]);
  vertices.push([ 50.0, -50.0,  50.0]);
  vertices.push([ 50.0,  50.0,  50.0]);
  vertices.push([-50.0,  50.0,  50.0]);
  
  vertices.push([-50.0, -50.0, -50.0]);
  vertices.push([ 50.0, -50.0, -50.0]);
  vertices.push([ 50.0,  50.0, -50.0]);
  vertices.push([-50.0,  50.0, -50.0]);
  
  // Define faces
  faces = [];
  
  faces.push([vertices[0], vertices[1], vertices[2], vertices[3]]); //  front
  faces.push([vertices[4], vertices[5], vertices[6], vertices[7]]); // back
  faces.push([vertices[4], vertices[5], vertices[1], vertices[0]]); // top
  faces.push([vertices[3], vertices[2], vertices[6], vertices[7]]); // bottom
  faces.push([vertices[4], vertices[0], vertices[3], vertices[7]]); // left
  faces.push([vertices[1], vertices[5], vertices[6], vertices[2]]); // right
  
  // Define perspective projection matrix
  projectionMatrix = [];
  projectionMatrix.push([1.0, 0.0, 0.0, 0.0]);
  projectionMatrix.push([0.0, 1.0, 0.0, 0.0]);
  projectionMatrix.push([0.0, 0.0, 1.0, 0.0]);
  projectionMatrix.push([0.0, 0.0, 0.0, 1.0]);
  
  let f = 1.0 / tan(PI/6.0); // field of view
  let ar = height / width; // aspect ratio
  
  camZ = 350; // translation distance
  let far = camZ * 10.0; // near plane
  let near = camZ / 10.0; // far plane
  
  // Populate projection matrix
  projectionMatrix[0][0] = f * ar;
  projectionMatrix[1][1] = f;
  projectionMatrix[2][2] = -(far+near)/(far-near);
  projectionMatrix[2][3] = -2.0*(far*near)/(far-near);
  projectionMatrix[3][2] = 1.0;
  projectionMatrix[3][3] = 0.0;
  
  angleX = 0.0;
  
  
}

function draw() {
  background(220);
  
  // increment angle of rotation
  angleX += 0.01;
  
  // create x rotation matrix
  let rotXMat = [];
  rotXMat.push([1.0, 0.0, 0.0]);
  rotXMat.push([0.0, cos(angleX), -sin(angleX)]);
  rotXMat.push([0.0, sin(angleX), cos(angleX)]);
  
  // Iterate over every face in cube
  for (let face of faces){
    
    beginShape();
    
    // Iterate over every vertex in face
    for (let vertx of face){
      
      let temp = [...vertx]; // make copy of vector
      
      let rotVertex = vecMatMul3x3(temp, rotXMat); // rotation
      
      // translate vertex
      rotVertex[2] += camZ;
      
      let projVrtx = vecMatMul4x4(rotVertex.concat(1.0), projectionMatrix); // perspective projection
      
      // divide by w (original z)
      let x = projVrtx[0];
      let y = projVrtx[1];
      let w = projVrtx[3];
      x /= w;
      y /= w;
      
      // map from [-1,1] to [0, width] and [0, height]
      x += 1.0;
      x *= 0.5 * width;
      
      y += 1.0;
      y *= 0.5 * height;
      
      vertex(x, y);
      
    }
    
    endShape(CLOSE);
    
  }
}

// 4x4 vector matrix multiplication
function vecMatMul4x4(v, m){
  let tmp = [0.0, 0.0, 0.0, 0.0];
  tmp[0] = v[0]*m[0][0] + v[1]*m[0][1] + v[2]*m[0][2] + v[3]*m[0][3];
  tmp[1] = v[0]*m[1][0] + v[1]*m[1][1] + v[2]*m[1][2] + v[3]*m[1][3];
  tmp[2] = v[0]*m[2][0] + v[1]*m[2][1] + v[2]*m[2][2] + v[3]*m[2][3];
  tmp[3] = v[0]*m[3][0] + v[1]*m[3][1] + v[2]*m[3][2] + v[3]*m[3][3];
  return tmp;
}

// 3x3 vector matrix multiplication
function vecMatMul3x3(v, m){
  let tmp = [0.0, 0.0, 0.0];
  
  tmp[0] = v[0]*m[0][0] + v[1]*m[0][1] + v[2]*m[0][2];
  tmp[1] = v[0]*m[1][0] + v[1]*m[1][1] + v[2]*m[1][2];
  tmp[2] = v[0]*m[2][0] + v[1]*m[2][1] + v[2]*m[2][2];
  
  return tmp;
}