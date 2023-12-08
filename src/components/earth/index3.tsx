import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import worldGeoJson from "../../assets/geo.json";
import * as d3 from "d3-geo";
import { defineComponent, onMounted, ref } from "vue";
import Stats from "three/addons/libs/stats.module.js";
import { createSky } from "./sky";
import { createEarth } from "./earth";
import { createLight } from "./light";
import { createCamera } from "./camera";
import { onMouseClick } from "./mouse";

export default defineComponent({
  name: "Earth",
  setup() {
    const container = ref<HTMLDivElement | null>(null);
    onMounted(() => {
      if (!container.value) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      createLight(scene);
      createSky(scene);

      const earthGeometry = new THREE.SphereGeometry(14, 96, 96);
      const earthMaterial = new THREE.MeshLambertMaterial({ color: "#151b24" });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);

      const object3D = new THREE.Object3D();
      object3D.add(earth);
      scene.add(object3D);

      camera.position.z = 50;

      const controls = new OrbitControls(camera, renderer.domElement);

      // 使用 d3-geo 将 GeoJSON 数据转换为 Three.js 几何体
      const projection = d3.geoEquirectangular().fitExtent(
        [
          [0, 0],
          [2, 2],
        ],
        worldGeoJson
      );
      const pathGenerator = d3.geoPath().projection(projection);
      const features = worldGeoJson.features;

      features.forEach((feature) => {
        const pathString = pathGenerator(feature);
        if (!pathString) return;

        const coordinates = pathString
          .match(/(?<=M).+?(?=Z)/g)?.[0]
          ?.split("L")
          .map((coordStr) => coordStr.trim().split(",").map(parseFloat));
        if (!coordinates) return;

        const vertices = coordinates.flatMap(([x, y]) => {
          const [long, lat] = projection.invert([x, y]);
          const coord = new THREE.Vector3().setFromSpherical(
            new THREE.Spherical(
              14.001,
              THREE.MathUtils.degToRad(90 - lat),
              THREE.MathUtils.degToRad(long)
            )
          );
          return [coord.x, coord.y, coord.z];
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(vertices), 3)
        );
        const material = new THREE.LineBasicMaterial({
          color: '#0000ff',
        }); // 使用特定颜色
        const line = new THREE.Line(geometry, material);
        line.userData = { country: feature.properties.name };
        object3D.add(line);
      });

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // 添加鼠标点击事件监听器
      window.addEventListener("click", (event) => {
        event.preventDefault();

        // 将鼠标点击位置转换为归一化设备坐标
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 更新射线投射器
        raycaster.setFromCamera(mouse, camera);

        // 计算与射线相交的对象
        const intersects = raycaster.intersectObjects(object3D.children);

        if (intersects.length > 0) {
          // 获取第一个相交对象
          const intersect = intersects[0];

          // 获取相交对象的中心
          const center = new THREE.Vector3();
          intersect.object.geometry.computeBoundingSphere();
          intersect.object.geometry.boundingSphere.getCenter(center);

          // 将相机位置设置为对象中心的两倍距离
          camera.position.set(center.x * 2, center.y * 2, center.z * 2);
          camera.lookAt(center);

          console.log("Country:", intersect.object.userData.country);
        }
      });

      const animate = () => {
        requestAnimationFrame(animate);

        // earth.rotation.y += 0.01;

        controls.update();

        renderer.render(scene, camera);
      };

      animate();

      // window.addEventListener('click', (event) => {
      //   onMouseClick(event, camera, scene);
      // }, false);
    });

    return () => (
      <div
        ref={container}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></div>
    );
  },
});
