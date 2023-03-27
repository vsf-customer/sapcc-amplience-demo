<template>
  <div id="checkout">
    <div class="checkout">
      <div class="checkout__main">
        <SfSteps
          v-if="!isThankYou"
          :active="currentStepIndex"
          :class="{ checkout__steps: true, 'checkout__steps-email_assigned': isEmailAssigned }"
          @change="handleStepClick"
        >
          <SfStep v-for="(step, key) in STEPS" :key="key" :name="step">
            <nuxt-child />
          </SfStep>
        </SfSteps>
        <nuxt-child v-else />
      </div>
      <div v-if="!isThankYou" class="checkout__aside desktop-only">
        <transition name="fade">
          <CartPreview key="order-summary" />
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { SfSteps, SfButton } from '@storefront-ui/vue';
import CartPreview from '~/components/Checkout/CartPreview';
import {computed, useRoute, useRouter} from '@nuxtjs/composition-api';
import { useCart, ANONYMOUS_USER_ID } from '@vsf-enterprise/sapcc';
import { useVSFContext } from '@vue-storefront/core';

export default {
  name: 'Checkout',
  components: {
    SfButton,
    SfSteps,
    CartPreview
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const { cart } = useCart('main');
    const {localePath} = useVSFContext();
    const STEPS = {
      Email: context.root.$t('Provide email'),
      Shipping: context.root.$t('Shipping'),
      Payment: context.root.$t('Payment')
    };
    const isEmailAssigned = computed(() => {
      return cart.value?.user.uid !== ANONYMOUS_USER_ID;
    });
    const toPascalCase = (text) =>
      text.replace(
        /(\w)(\w*)/g,
        (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
      );
    const currentStep = computed(() =>
      toPascalCase(route.value.path.split('/').pop())
    );
    const currentStepIndex = computed(() =>
      Object.keys(STEPS).findIndex((s) => s === currentStep.value)
    );
    const isThankYou = computed(() => currentStep.value === 'Thank-You');

    const handleStepClick = (stepIndex) => {
      const key = Object.keys(STEPS)[stepIndex];
      router.push(localePath(`/Checkout/${key}`));
    };

    return {
      handleStepClick,
      STEPS,
      currentStepIndex,
      isThankYou,
      currentStep,
      isEmailAssigned
    };
  }
};
</script>

<style lang="scss" scoped>
#checkout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.checkout {
  @include for-desktop {
    display: flex;
  }
  &__main {
    @include for-desktop {
      flex: 1;
      padding: var(--spacer-xl) 0 0 0;
    }
  }
  &__aside {
    @include for-desktop {
      flex: 0 0 25.5rem;
      margin: 0 0 0 4.25rem;
    }
  }
  &__steps {
    --steps-content-padding: 0 var(--spacer-base);
    @include for-desktop {
      --steps-content-padding: 0;
    }

    &-auth::v-deep .sf-steps__step:first-child {
      --steps-step-color: #e8e4e4;
    }
    &-email_assigned::v-deep .sf-steps__step:first-child {
      pointer-events: none;
      --steps-step-color: #e8e4e4;
    }
  }
}
</style>
