import { AmbientLight, SphereGeometry, MeshPhongMaterial, Mesh, PointLight, DirectionalLight } from 'three';
export const createLight = (scene: any) => {
  let ambientLight = new AmbientLight(0x404040, 10); // soft white light
  scene.add(ambientLight);

  let sun = new DirectionalLight(0xffffff, 3);
  sun.position.set(1, 1, 1); // 设置光源的方向
  scene.add(sun);

  let star = new PointLight(0xffffff, 1, 100);
  star.position.set(50, 50, 50); // 设置光源的位置
  scene.add(star);

  let geometry = new SphereGeometry(1, 32, 32);
  let material = new MeshPhongMaterial({ color: 0xaaaaaa });
  let planet = new Mesh(geometry, material);
  scene.add(planet);
  }