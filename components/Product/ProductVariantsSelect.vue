<template>
  <SfSelect
    class="sf-select--underlined"
    :label="$t(label)"
    :value="value"
    @input="onOptionSelected"
    required
  >
    <SfSelectOption
      v-for="option in options"
      :key="option.code"
      :value="option.code"
    >
      {{ getOptionValue(option) }}
    </SfSelectOption>
  </SfSelect>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfSelect } from '@storefront-ui/vue';

export default defineComponent({
  components: { SfSelect },
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
  setup(_, context) {
    const onOptionSelected = (variant) => {
      context.emit('selected', variant);
    };

    const getOptionValue = (option) => option.variantOptionQualifiers[0].value;

    return {
      getOptionValue,
      onOptionSelected
    };
  }
});
</script>
