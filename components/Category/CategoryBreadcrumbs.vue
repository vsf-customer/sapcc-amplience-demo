<template>
  <SfBreadcrumbs
    class="category-breadcrumbs desktop-only"
    :breadcrumbs="breadcrumbs"
  />
</template>

<script>
import { defineComponent, computed, useContext } from '@nuxtjs/composition-api';
import { SfBreadcrumbs } from '@storefront-ui/vue';

export default defineComponent({
  name: 'CategoryBreadcrumbs',
  components: { SfBreadcrumbs },
  props: {
    categoryBreadcrumbs: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { localePath, i18n } = useContext();

    const breadcrumbs = computed(() => ([
      {
        text: i18n.t('Home'),
        link: localePath('/')
      },
      ...props.categoryBreadcrumbs
    ]));

    return { breadcrumbs };
  }
});
</script>

<style lang="scss" scoped>
.category-breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
</style>
