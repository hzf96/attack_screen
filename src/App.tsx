import { defineComponent } from 'vue';
import Earth from './components/earth/index';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div id="app">
        <Earth />
      </div>
    );
  },
});