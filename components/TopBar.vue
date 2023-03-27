<template>
  <SfTopBar class="topbar">
    <template #left>
      <SfButton
        v-if="isAuthenticated"
        class="sf-button--text"
      >
        {{ $t('Help & FAQs') }}
      </SfButton>
      <SfButton
        v-else
        class="sf-button--text"
        @click="openAnonymousConsentsModal"
      >
        {{ $t('Manage consents') }}
      </SfButton>
    </template>
    <template #center>
      <p>{{ $t('Download') }}</p>
      <SfButton class="topbar__button sf-button--text">{{ $t('Find out more') }}</SfButton>
    </template>
    <template #right>
      <CurrencySelector />
      <LocaleSelector />
    </template>
  </SfTopBar>
</template>

<script>
import { SfButton, SfTopBar } from '@storefront-ui/vue';
import LocaleSelector from './LocaleSelector';
import CurrencySelector from './CurrencySelector';
import { useUser } from '@vsf-enterprise/sapcc';
import { useUiState } from '~/composables';

export default {
  components: {
    CurrencySelector,
    SfTopBar,
    SfButton,
    LocaleSelector
  },
  setup() {
    const { isAuthenticated } = useUser();
    const { toggleAnonymousConsentsModal, acceptCookies } = useUiState();

    const openAnonymousConsentsModal = () => {
      acceptCookies();
      toggleAnonymousConsentsModal();
    };
    return { isAuthenticated, openAnonymousConsentsModal };
  }
};

</script>
<style lang="scss" scoped>
.topbar {
  position: relative;
  z-index: 2;
  &__button {
    margin: 0 0 0 var(--spacer-xs);
  }
}
</style>
