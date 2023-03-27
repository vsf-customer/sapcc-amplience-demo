<template>
  <SfCallToAction
    v-if="!isCookiesAccepted"
    class="cookie-consent"
    :title="$t('Cookie Consent')"
    background="white"
  >
    <template #description>
      <div class="sf-call-to-action__description">
        <p>
          {{ $t('Cookie consent') }}
          <SfLink :link="localePath({ name: 'home' })">
            {{ $t('Our Privacy Policy') }}
          </SfLink>
        </p>
      </div>
    </template>
    <template #button>
      <div class="cookie-consent__buttons">
        <SfButton
          class="cookie-consent__button"
          data-testid="cta-button"
          @click="goToCookieSettings"
        >
          {{ $t('Settings') }}
        </SfButton>
        <div class="cookie-consent__buttons__spacer" />
        <SfButton
          class="cookie-consent__button"
          data-testid="cta-button"
          @click="acceptAllCookies"
        >
          {{ $t('Accept all') }}
        </SfButton>
      </div>
    </template>
  </SfCallToAction>
</template>

<script>
import { defineComponent, useRouter } from '@nuxtjs/composition-api';
import { SfLink, SfCallToAction, SfButton } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { useUser, useConsents } from '@vsf-enterprise/sapcc';
import { useVSFContext } from '@vue-storefront/core';

export default defineComponent({
  name: 'CookieConsent',
  components: { SfLink, SfCallToAction, SfButton },
  setup() {
    const router = useRouter();
    const { localePath } = useVSFContext();
    const { isAuthenticated } = useUser();
    const { giveAllConsents } = useConsents();
    const { toggleAnonymousConsentsModal, isCookiesAccepted, acceptCookies } = useUiState();

    const acceptAllCookies = async () => {
      await giveAllConsents();
      acceptCookies();
    };

    const goToCookieSettings = () => {
      acceptCookies();
      if (isAuthenticated.value) {
        router.push(localePath({ name: 'my-consents' }));
      } else {
        toggleAnonymousConsentsModal();
      }
    };

    return {
      isCookiesAccepted,
      acceptAllCookies,
      goToCookieSettings
    };
  }
});
</script>

<style lang="scss" scoped>
.cookie-consent {
  --call-to-action-color: var(--c-dark);
  --call-to-action-title-font-line-height: 1.2;
  --call-to-action-title-font-size: var(--font-size--base);
  --call-to-action-title-font-weight: var(--font-weight--bold);
  --call-to-action-description-font-size: var(--font-size--sm);
  --call-to-action-description-font-weight: var(--font-weight--normal);
  --call-to-action-description-margin: 0;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 0;
  padding: 1rem 2rem;
  border: 1px solid #d4d8df;
  z-index: 2;

  &__button {
    width: 100%;
  }

  &__buttons {
    &__spacer {
      height: var(--spacer-xs);
    }
  }

  ::v-deep .sf-call-to-action__title {
    @include for-mobile {
      margin-bottom: 0;
    }
  }
}
</style>
