<template>
  <div id="home"> </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'Home',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  middleware({ redirect, route, localePath }) {
    const { query } = route;
    return redirect({ path: localePath('/home-page'), query });
  },
  setup() {
    return {};
  }
});
</script>

<style lang="scss"> </style>
