import { Raycaster, Vector2 } from 'three';
export const onMouseClick = (event, camera, scene) => {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围都是 (-1 to +1)
  let raycaster = new Raycaster();
  let mouse = new Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera);

  // 计算物体和射线的焦点
  let intersects = raycaster.intersectObjects(scene.children, false);
  if (intersects.length > 0) {
    let point = intersects[0].point;
    console.log(point); // 这是点击的三维坐标

    // 聚焦到这个点
    camera.lookAt(point);
  }
}