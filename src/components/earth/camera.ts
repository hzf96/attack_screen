import { PerspectiveCamera } from "three";
export const createCamera = (width: number,height: number)=>{
  let aspect = width / height;
  let camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(60, 26, 10);

  return camera
}

