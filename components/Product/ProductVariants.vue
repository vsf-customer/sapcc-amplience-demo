<template>
  <div data-testid="product-variants" class="product-variants">
    <!-- Variants -->
    <div v-for="(variant, index) of variants" :key="index">
      <component
        :is="getVariantComponentName(variant)"
        :label="getVariantLabel(variant)"
        :value="getVariantValue(variant)"
        :options="variant.options"
        @selected="selectVariant"
      />
    </div>
    <!-- Sub variants -->
    <ProductVariantsSelect
      v-if="subVariants && subVariants.length"
      :label="getVariantLabel(product)"
      :options="subVariants"
      @selected="selectVariant"
    />
  </div>
</template>

<script>
import { defineComponent, computed, useRouter, useContext } from '@nuxtjs/composition-api';
import ProductVariantsSelect from '~/components/Product/ProductVariantsSelect';
import ProductVariantsImages from '~/components/Product/ProductVariantsImages';

export default defineComponent({
  name: 'ProductVariants',
  components: { ProductVariantsSelect, ProductVariantsImages },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { localePath } = useContext();
    const router = useRouter();

    const variantTypeNames = {
      ApparelStyleVariantProduct: 'Style',
      ApparelSizeVariantProduct: 'Size'
    };

    const variants = computed(() => props.product.baseOptions.reverse());
    const subVariants = computed(() => props.product.variantOptions);

    const getVariantLabel = (variant) => variantTypeNames[variant.variantType];
    const getVariantValue = (variant) => variant.selected?.code;
    const getVariantComponentName = (variant) => {
      const optionsHaveImages = variant.selected?.variantOptionQualifiers[0].image;
      return optionsHaveImages ? 'ProductVariantsImages' : 'ProductVariantsSelect';
    };

    const selectVariant = (variantId) => {
      const routeToPush = {
        name: 'product',
        params: {
          id: variantId,
          slug: 'defails'
        }
      };
      router.push(localePath(routeToPush));
    };

    return {
      variants,
      subVariants,
      selectVariant,
      getVariantValue,
      getVariantLabel,
      variantTypeNames,
      getVariantComponentName
    };
  }
});
</script>

<style lang="scss" scoped>
.product-variants {
  margin: var(--spacer-base) 0;
}
</style>
