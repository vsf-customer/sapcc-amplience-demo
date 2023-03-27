<template>
  <SfModal
    class="consents-modal"
    :visible="isAnonymousConsentsModalOpen"
    @close="toggleAnonymousConsentsModal"
  >
    <template #modal-bar>
      <SfBar
        class="consents-modal__title smartphone-only"
        :close="true"
        :title="$t('Manage consents')"
        @click:close="toggleAnonymousConsentsModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div v-if="consents && consents.consentTemplates.length">
        <SfHeading
          class="consents-modal__title sf-heading--left"
          :level="3"
          :title="$t('Manage consents')"
          :description="$t('Choose your cookie preferences. You can change them at any time.')"
        />
        <div
          class="consents-modal__consent"
          v-for="template in consents.consentTemplates"
          :key="template.id"
        >
          <p class="consents-modal__consent__name">
            {{ template.name }}
          </p>
          <SfCheckbox
            :selected="isAccepted(template)"
            :name="template.id"
            :label="template.description"
            @change="toggleConsent(template)"
          />
        </div>
        <SfButton
          class="consents-modal__close sf-button--full-width"
          @click="toggleAnonymousConsentsModal"
        >
          {{ $t('Done') }}
        </SfButton>
      </div>
    </transition>
  </SfModal>
</template>
<script>
import { SfModal, SfHeading, SfInput, SfButton, SfScrollable, SfBar, SfLink, SfCheckbox } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { useConsents } from '@vsf-enterprise/sapcc';

export default {
  name: 'AnonymousConsentsModal',
  components: {
    SfModal,
    SfHeading,
    SfInput,
    SfButton,
    SfScrollable,
    SfBar,
    SfLink,
    SfCheckbox
  },
  setup() {
    const { isAnonymousConsentsModalOpen, toggleAnonymousConsentsModal } = useUiState();
    const { consents, isAccepted, giveConsent, removeConsent } = useConsents();

    const toggleConsent = (template) => {
      if (isAccepted(template)) {
        removeConsent({
          consentTemplateId: template.id,
          consentCode: 0
        });
      } else {
        giveConsent({
          consentTemplateId: template.id,
          consentTemplateVersion: template.version
        });
      }
    };

    return {
      isAnonymousConsentsModalOpen,
      toggleAnonymousConsentsModal,
      consents,
      isAccepted,
      toggleConsent
    };
  }
};
</script>

<style lang="scss" scoped>
.consents-modal {
  display: flex;
  justify-content: center;
  --modal-index: 3;
  --overlay-z-index: 3;

  @include for-desktop {
    --modal-content-padding: var(--spacer-xl);
  }

  &__title {
    @include for-mobile {
      ::v-deep .sf-heading__title {
        display: none;
      }
      ::v-deep .sf-heading__description {
        margin-top: 0;
      }
    }
  }

  &__consent {
    &__name {
      font-weight: var(--font-weight--semibold);
    }
  }

  &__close {
    margin-top: var(--spacer-lg);
  }

  ::v-deep .sf-scrollable__view-all.sf-button {
    display: none;
  }
}
</style>
