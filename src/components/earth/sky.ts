import * as THREE from 'three';
export const createSky = (scene) => {
  // 创建背景星空
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starMaterial = new THREE.PointsMaterial({ color: '#bef0db', size: 1, transparent: true, opacity: 0.5 });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
}