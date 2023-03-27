<template>
  <SfBreadcrumbs
    class="product__breadcrumbs desktop-only"
    :breadcrumbs="breadcrumbs"
  />
</template>

<script>
import { defineComponent, computed, useContext } from '@nuxtjs/composition-api';
import { productGetters } from '@vsf-enterprise/sapcc';
import { SfBreadcrumbs } from '@storefront-ui/vue';

export default defineComponent({
  name: 'ProductBreadcrumbs',
  components: { SfBreadcrumbs },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup({ product }) {
    const { localePath } = useContext();
    const breadcrumbs = computed(() =>
      productGetters.getBreadcrumbs(product).map((e) => ({
        ...e,
        link: localePath(e.link)
      }))
    );

    return { breadcrumbs };
  }
});
</script>

<style lang="scss" scoped>
.product {
  &__breadcrumbs {
    margin: var(--spacer-base) auto var(--spacer-lg);
  }
}
</style>
