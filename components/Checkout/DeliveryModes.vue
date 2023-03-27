<template>
  <div class="delivery-modes">
    <SfHeading
      class="delivery-modes__title sf-heading--left sf-heading--no-underline"
      data-testid="shipping-method-header"
      :level="3"
      :title="$t('Shipping method')"
    />

    <template v-if="!loading.load && deliveryModes.length" >
      <SfRadio
        v-for="mode in deliveryModes"
        :key="mode.code"
        class="delivery-mode form__radio"
        data-testid="shipping-method-label"
        :label="mode.name"
        :value="mode.code"
        :selected="selectedMode"
        @input="selectMode(mode.code)"
        name="deliveryMode"
        :description="mode.description"
      >
        <template #label="{ label }">
          <div class="delivery-mode__label sf-radio__label">
            <p>{{ label }}</p>
            <p>{{ mode.deliveryCost.formattedValue }}</p>
          </div>
        </template>
        <template #description="{ description }">
          <p class="delivery-mode__description sf-radio__description">
            {{ description }}
          </p>
        </template>
      </SfRadio>
      <SfButton
        class="delivery-modes__submit-button"
        data-testid="'continue-to-billing'"
        :disabled="isSubmitButtonDisabled"
        type="button"
        @click="$emit('submit', selectedMode)"
      >
        {{ $t('Continue to payment') }}
      </SfButton>
    </template>

    <SfLoader v-else-if="loading.load" :loading="true" />

    <p v-else>
      {{ $t('There are no shipping methods available for this country. Please, choose a different country or try again later.') }}
    </p>
  </div>
</template>

<script>
import { SfButton, SfRadio, SfLoader, SfHeading } from '@storefront-ui/vue';
import { ref, onMounted, computed } from '@nuxtjs/composition-api';
import { useCart, useCartDeliveryModes } from '@vsf-enterprise/sapcc';

export default {
  name: 'DeliveryModes',
  components: {
    SfButton,
    SfRadio,
    SfLoader,
    SfHeading
  },
  setup() {
    const { cart } = useCart('main');
    const { load, deliveryModes, loading } = useCartDeliveryModes('main');

    const selectedMode = ref(cart.value.deliveryMode?.code);

    const isSubmitButtonDisabled = computed(() => !selectedMode.value || loading.value.set);

    const selectMode = (mode) => (selectedMode.value = mode);

    onMounted(async () => {
      await load();
    });

    return {
      deliveryModes,
      loading,
      selectedMode,
      selectMode,
      isSubmitButtonDisabled
    };
  }
};
</script>

<style lang="scss" scoped>
.delivery {
  &-modes {
    &__title {
      margin-bottom: var(--spacer-base);
    }
    &__submit-button {
      margin-top: var(--spacer-sm);
    }
  }
  &-mode {
    ::v-deep .sf-radio__container {
      padding-right: var(--spacer-sm);
    }
    &__label {
      display: flex;
      justify-content: space-between;
      p {
        margin: 0;
      }
    }

    &__description {
      --radio-description-margin: 0;
      --radio-description-font-size: var(--font-xs);
    }
  }
}
</style>
