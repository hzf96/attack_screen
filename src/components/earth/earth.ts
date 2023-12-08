import earthTexture from "../../assets/earth.png";
import glowTexture from "../../assets/earth_glow.png";
import worldJson from "../../assets/geo.json";
import * as THREE from 'three';
import { Group, SpriteMaterial, Sprite, TextureLoader, SphereGeometry, MeshLambertMaterial, Mesh, Object3D } from 'three';
import { createCountryLine } from './country';
export const createSphereMesh = (R) => {
  // let textureLoader = new TextureLoader();
  // let texture = textureLoader.load(earthTexture);
  let geometry = new SphereGeometry(R, 96, 96);
  // let material = new MeshLambertMaterial({
  //   map: texture,
  // });
  let material = new MeshLambertMaterial({
    color: '#161c26',
  });
  let mesh = new Mesh(geometry, material); //网格模型对象Mesh
  // let object3D = new Object3D();
  // object3D.add(createCountryLine(R + 0.01));
  // object3D.add(mesh);
  // return object3D;
  return mesh;
};

export const createSprite = (R) => {
  var textureLoader = new TextureLoader();
  var texture = textureLoader.load(glowTexture);//加载纹理贴图
  var spriteMaterial = new SpriteMaterial({
    map: texture, //设置贴图
    transparent: true,//开启透明
    opacity: 0.5,//通过透明度整体调节光圈
  });
  var sprite = new Sprite(spriteMaterial);
  sprite.scale.set(R * 3.0, R * 3.0, 1);//缩放精灵
  return sprite;
}

export const createEarth = (R, scene: any) => {
  var earthGroup = new Group();//地球组对象
  earthGroup.add(createSphereMesh(R));//球体Mesh插入earthGroup中
  earthGroup.add(createSprite(R));//地球光圈

  worldJson.features.forEach((country: any) => {
    if (country.geometry.type === "Polygon") {
      // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
      country.geometry.coordinates = [country.geometry.coordinates];
    }
    var line = createCountryLine(R * 1.002, country.geometry.coordinates);//国家边界


    // let material = new MeshLambertMaterial({
    //   color: '#161c26',
    // });
    // let mesh = new Mesh(line, material); //网格模型对象Mesh
    earthGroup.add(line);
  });
  scene.add(earthGroup);

  return earthGroup;
}
