<template>
  <div class="search-no-result">
    <SfImage
      src="/error/error.svg"
      class="search-no-result__picture"
      data-testid="search-no-results-image"
      :alt="$t('error')"
      loading="lazy"
      :width="300"
      :height="300"
      :image-tag="$globalImgTag"
    />
    <p class="search-no-result__paragraph" data-testid="search-no-result-first-paragraph">
      {{ $t('You haven’t searched for items yet') }}
    </p>
    <p class="search-no-result__paragraph" data-testid="search-no-result-second-paragraph">
      {{ $t('Let’s start now – we’ll help you') }}
    </p>
    <SfButton
      class="search-no-result__button color-secondary smartphone-only"
      @click="closeSearchModal"
    >
      {{ $t('Go back') }}
    </SfButton>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfImage, SfButton } from '@storefront-ui/vue';
import { useUiState } from '~/composables';

export default defineComponent({
  name: 'SearchNoResults',
  components: { SfImage, SfButton },
  setup() {
    const { closeSearchModal } = useUiState();
    return { closeSearchModal };
  }
});
</script>

<style lang="scss" scoped>
.search-no-result {
  box-sizing: border-box;
  padding: var(--spacer-base) var(--spacer-sm);
  width: 100%;
  text-align: center;
  @include for-desktop {
    padding: 0;
  }
  &__picture {
    --image-width: 230px;
    margin-top: var(--spacer-2xl);
    @include for-desktop {
      --image-width: 18.75rem;
      margin-top: var(--spacer-base);
    }
  }
  &__paragraph {
    font-family: var(--font-family--primary);
    font-weight: var(--font-weight--normal);
    font-size: var(--font-size--base);
    color: var(--c-text-muted);
    margin: 0;
    @include for-desktop {
      font-size: var(--font-size--lg);
    }
    &:first-of-type {
      margin: var(--spacer-xl) auto var(--spacer-xs);
    }
  }
  &__button {
    margin: var(--spacer-xl) auto 0 auto;
    width: 100%;
  }
}
</style>
