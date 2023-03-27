<template>
  <div class="container">
    <client-only>
      <SfButton
        v-if="availableCurrencies.length"
        class="container__lang container__lang--selected"
        @click="toggleCurrencySelector"
      >
        {{ selectedCurrencySymbol }}
      </SfButton>
    </client-only>
    <SfBottomModal :is-open="isOpen" :title="$t('Choose currency')" @click:close="toggleCurrencySelector">
      <SfList>
        <SfListItem v-for="currency in availableCurrencies" :key="currency.isocode">
            <SfCharacteristic @click.native="switchCurrency(currency)" class="language">
              <template #title>
                <span>{{ currency.name }}</span>
              </template>
              <template #icon>
                {{ currency.symbol }}
              </template>
            </SfCharacteristic>
        </SfListItem>
      </SfList>
    </SfBottomModal>
  </div>
</template>

<script>
import {
  SfImage,
  SfSelect,
  SfButton,
  SfList,
  SfBottomModal,
  SfCharacteristic
} from '@storefront-ui/vue';
import { ref, computed, useRouter } from '@nuxtjs/composition-api';
import { useVSFContext, VSF_CURRENCY_COOKIE } from '@vue-storefront/core';
import { useStore } from '@vsf-enterprise/sapcc';

export default {
  components: {
    SfImage,
    SfSelect,
    SfButton,
    SfList,
    SfBottomModal,
    SfCharacteristic
  },
  setup() {
    const { app: { $cookies } } = useVSFContext();
    const { store } = useStore();
    const router = useRouter();
    const selectedCurrency = $cookies.get(VSF_CURRENCY_COOKIE) || {};

    const isOpen = ref(false);

    const storeCurrencies = computed(() => store.value?.currencies);
    const selectedCurrencySymbol = computed(() =>
      storeCurrencies.value.find(currency => currency.isocode === selectedCurrency)?.symbol
    );
    const availableCurrencies = computed(() =>
      storeCurrencies.value.filter(currency => currency.isocode !== selectedCurrency) ?? []
    );

    function switchCurrency (currency) {
      $cookies.set(VSF_CURRENCY_COOKIE, currency.isocode);
      router.go();
    }

    function toggleCurrencySelector () {
      isOpen.value = !isOpen.value;
    }

    return {
      availableCurrencies,
      selectedCurrencySymbol,
      isOpen,
      switchCurrency,
      toggleCurrencySelector
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-right: 1rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  .sf-bottom-modal {
    z-index: 2;
    left: 0;
    @include for-desktop {
      --bottom-modal-height: 100vh;
    }
  }
  .sf-list {
    .language {
      cursor: pointer;
      padding: var(--spacer-sm);
      &__flag {
        margin-right: var(--spacer-sm);
      }
      &:hover{
        background-color: var(--_c-light-primary-darken);
      }
    }
    @include for-desktop {
      display: flex;
    }
  }
  &__lang {
    width: 20px;
    --button-box-shadow: none;
    padding: 0 5px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    opacity: 0.5;
    border: none;
    &:hover,
    &--selected {
      opacity: 1;
    }
  }
}
</style>
