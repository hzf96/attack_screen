import {
  BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  LineLoop,
  Group,
  Vector3,
  BufferGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";
// import pointArr from "../../assets/world.json";

// 创建国家边界线
export const createCountryLine = (R: number, polygonArr: any) => {
  var group = new Group();// 组对象mapGroup是所有国家边界父对象
  polygonArr.forEach((polygon: any) => {
    var pointArr: any = [];//边界线顶点坐标
    polygon[0].forEach((elem: any) => {
      // 经纬度转球面坐标
      var coord = latLongToVector3(R, elem[0], elem[1])
      pointArr.push(coord.x, coord.y, coord.z);
    });
    group.add(createLine(pointArr));
  });
  return group;
}

// pointArr：边界坐标
export const createLine = (pointArr: any) => {
  var geometry = new BufferGeometry(); //创建一个Buffer类型几何体对象
  var vertices = new Float32Array(pointArr);//创建顶点数据
  //BufferAttribute这个类用于存储与BufferGeometry相关联的 attribute（例如顶点位置向量，面片索引，法向量，颜色值，UV坐标以及任何自定义 attribute ）。 利用 BufferAttribute，可以更高效的向GPU传递数据。
  var attribue = new BufferAttribute(vertices, 3); //表示一个顶点的xyz坐标
  geometry.attributes.position = attribue; // 设置几何体attributes属性的位置属性

  var material = new LineBasicMaterial({
    color: 0x00aaaa
  });
  var line = new LineLoop(geometry, material);//线条模型对象，首尾顶点连线
  return line;
}

// export const latLongToVector3 = (radius: number, lon: any, lat: any) => {
//   let phi = (90 - lat) * (Math.PI / 180);
//   let theta = (lon + 180) * (Math.PI / 180);

//   let x = -(radius * Math.sin(phi) * Math.cos(theta));
//   let z = radius * Math.sin(phi) * Math.sin(theta);
//   let y = radius * Math.cos(phi);

//   return new Vector3(x, y, z);
// }
function latLongToVector3(R, longitude, latitude) { //longitude：经度角度值,latitude：纬度角度值
  var lon = longitude * Math.PI / 180;//转弧度值
  var lat = latitude * Math.PI / 180;
  lon = -lon;// three.js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  var x = R * Math.cos(lat) * Math.cos(lon);
  var y = R * Math.sin(lat);
  var z = R * Math.cos(lat) * Math.sin(lon);
  // 返回球面坐标
  return new Vector3(x, y, z);
}


// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({ antialias: true });

// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// camera.position.z = 30;

// const controls = new OrbitControls(camera, renderer.domElement);

// // 创建一个不规则的Shape
// const shape = new THREE.Shape();
// shape.moveTo(0, 0);
// shape.lineTo(10, 10);
// shape.lineTo(20, 0);
// shape.lineTo(10, -10);
// shape.lineTo(0, 0);

// // 使用Shape创建一个几何体
// const geometry = new THREE.ShapeGeometry(shape);

// // 创建一个材质
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// // 创建一个Mesh
// const mesh = new THREE.Mesh(geometry, material);

// // 将Mesh添加到场景中
// scene.add(mesh);

// const animate = () => {
//   requestAnimationFrame(animate);

//   controls.update();
//   renderer.render(scene, camera);
// };

// animate();