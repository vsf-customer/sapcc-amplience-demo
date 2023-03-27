<template>
  <div class="image-variant">
    <SfImage
      v-for="option in options"
      :key="option.code"
      class="image-variant__link"
      :class="{ 'image-variant__link--selected': checkIsOptionSelected(option) }"
      :src="getOptionImage(option)"
      :alt="getOptionValue(option)"
      :width="50"
      :height="50"
      loading="lazy"
      :image-tag="$globalImgTag"
      @click="onOptionSelected(option)"
    />
  </div>
</template>

<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api';
import { SfImage } from '@storefront-ui/vue';

export default defineComponent({
  components: { SfImage },
  props: {
    label: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Object]
    }
  },
  setup(props, context) {
    const { $getCloudinaryUploadPath } = useContext();

    const onOptionSelected = (option) => {
      context.emit('selected', option.code);
    };

    const checkIsOptionSelected = (option) => option.code === props.value;
    const getOptionImage = (option) => $getCloudinaryUploadPath(option.variantOptionQualifiers[0].image.url);
    const getOptionValue = (option) => option.variantOptionQualifiers[0].value;

    return {
      getOptionValue,
      getOptionImage,
      onOptionSelected,
      checkIsOptionSelected
    };
  }
});
</script>

<style lang="scss" scoped>
.image-variant {
  margin-bottom: var(--spacer-xs);
  &__link {
    cursor: pointer;
    margin-right: var(--spacer-xs);
    border: 1px solid transparent;
    display: inline-flex;
    padding: var(--spacer-xs);
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacer-xs);

    &--selected {
      border: 1px solid var(--_c-green-primary);
    }
  }
}
</style>
