<template>
  <div @click="select" class="payment-details" :class="{ selected: selected }">
    <div v-if="!disabled" class="payment-details__header">
      <SfButton
        type="button"
        class="sf-button color-secondary"
        @click.stop="edit"
        :disabled="loading"
      >
        {{ $t('Edit') }}
      </SfButton>
      <SfButton
        type="button"
        class="sf-button color-secondary"
        @click.stop="remove"
        :disabled="loading"
      >
        {{ $t('Remove') }}
      </SfButton>
      <SfLoader v-if="loading" :loading="loading" />
      <div v-if="selected" class="icon-container">
        <SfIcon icon="check" class="sf-address__icon" />
      </div>
    </div>
    <div class="payment-details__content">
      <div v-if="!disabled" class="payment-details__default">
        <span v-if="item.defaultPayment">{{ $t('DEFAULT') }}</span>
        <SfButton
          v-else
          type="button"
          class="sf-button color-secondary"
          @click.stop="setDefault"
        >
          {{ $t('Set Default') }}
        </SfButton>
      </div>

      <div>{{ item.accountHolderName }}</div>
      <div>{{ item.cardNumber }}</div>
      <div>
        {{ $t('Expires') }}: {{ item.expiryMonth }}/{{ item.expiryYear }}
      </div>
      <div v-if="item.cardType">{{ item.cardType.name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { SfProperty, SfLoader, SfIcon, SfButton } from '@storefront-ui/vue';
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import { PaymentDetails } from '@vsf-enterprise/sap-commerce-webservices-sdk';

export default defineComponent({
  components: {
    SfProperty,
    SfLoader,
    SfIcon,
    SfButton
  },
  props: {
    item: {
      type: Object as PropType<PaymentDetails>,
      required: true
    },
    selectedId: String,
    loading: Boolean,
    disabled: Boolean
  },
  setup(props, { emit }) {
    const select = () => {
      if (!props.disabled) emit('select', props.item);
    };

    const remove = () => {
      emit('remove', props.item);
    };

    const edit = () => {
      emit('edit', props.item);
    };

    const setDefault = () => {
      emit('setDefault', props.item);
    };

    const selected = computed(
      () => props.selectedId === (props.item as PaymentDetails).id
    );

    return { select, remove, edit, setDefault, selected };
  }
});
</script>

<style scoped lang="scss">
.payment-details {
  background: var(--c-light);
  padding: var(--spacer-sm);
  overflow: hidden;
  border: 1px solid transparent;
  cursor: pointer;
  .icon-container {
    background: var(--c-primary);
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    margin-left: auto;
  }
  .sf-button {
    --button-padding: var(--spacer-sm);
    --button-height: var(--spacer-lg);
  }
  &.selected {
    border-color: var(--c-primary);
  }
  &__header {
    display: flex;
    align-items: center;
    padding-bottom: var(--spacer-sm);
    border-bottom: 1px solid var(--c-light-variant);
    .sf-button {
      margin-right: var(--spacer-sm);
    }
  }
  &__content {
    padding-top: var(--spacer-sm);
  }
  &__default {
    display: flex;
  }
}

@media (max-width: 1023px) {
  .payment-details .sf-button {
    --button-padding: var(--spacer-xs);
    --button-height: var(--spacer-md);
  }
}
</style>
