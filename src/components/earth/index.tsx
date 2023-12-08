import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/addons/libs/stats.module.js';
import { createSky } from './sky';
import { createEarth } from './earth';
import { createLight } from './light';
import { createCamera } from './camera';
import { onMouseClick } from './mouse';

export default defineComponent({
  name: 'Earth',
  setup() {
    const container = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      if (!container.value) return;

      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.value.appendChild(renderer.domElement);

      const camera = createCamera(window.innerWidth, window.innerHeight);

      const earth = createEarth(14, scene);

      // 显示fps
      const stats = new Stats();
      document.body.appendChild( stats.dom );

      // 创建粒子星空
      const stars = createSky(scene);

      createLight(scene);

      const controls = new OrbitControls(camera, renderer.domElement);

      const animate = () => {
        requestAnimationFrame(animate);

        // earth.rotation.y += 0.01;

        controls.update();

        stats.update();

        renderer.render(scene, camera);
      };

      animate();

      // window.addEventListener('click', (event) => {
      //   onMouseClick(event, camera, scene);
      // }, false);
    });

    return () => (
      <div ref={container} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}></div>
    );
  },
});