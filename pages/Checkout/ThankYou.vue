<template>
  <div class="thank-you">
    <SfCallToAction
      class="thank-you__banner"
      data-testid="thank-you-banner"
      :title="$t('Thank you for your order!')"
      :image="{
        mobile: '/thankyou/bannerM.png',
        desktop: '/thankyou/bannerD.png'
      }"
    >
      <template #description>
        <span>
          {{ $t('Order No.') }}
          <strong>{{ orderNumber }}</strong>
        </span>
      </template>
    </SfCallToAction>

    <section class="thank-you__summary">
      <div class="thank-you__contact">
        <SfHeading
          class="thank-you__summary__heading sf-heading--left"
          :title="$t('Your Purchase')"
          :description="$t('Successful placed order')"
          :level="3"
        />
        <SfHeading
          class="thank-you__summary__heading sf-heading--left"
          :title="$t('Primary contact for any questions')"
          :level="3"
        >
          <template #description>
            <div class="sf-heading__description">
              <p class="contact__name">{{ companyDetails.name }}</p>
              <p class="contact__street">{{ companyDetails.street }}</p>
              <p class="contact__city">{{ companyDetails.city }}</p>
              <p class="contact__email">{{ companyDetails.email }}</p>
            </div>
          </template>
        </SfHeading>
      </div>
      <CreateUserAfterGuestOrder
        v-if="orderDetails && orderDetails.guestCustomer && !isAuthenticated"
        class="thank-you__create-account"
      />
    </section>

    <SfButton
      class="thank-you__back-button color-secondary button-size"
      :link="localePath({ name: 'home' })"
    >
      {{ $t('Go back to shop') }}
    </SfButton>
  </div>
</template>

<script>
import { SfHeading, SfButton, SfCallToAction } from '@storefront-ui/vue';
import { ref, computed, useRoute, onMounted } from '@nuxtjs/composition-api';
import { useOrder, useUser } from '@vsf-enterprise/sapcc';
import CreateUserAfterGuestOrder from '~/components/Checkout/CreateUserAfterGuestOrder';

export default {
  components: {
    SfHeading,
    SfButton,
    SfCallToAction,
    CreateUserAfterGuestOrder
  },
  setup(_props, context) {
    context.emit('changeStep', 4);
    const route = useRoute();
    const { order, load } = useOrder();
    const { isAuthenticated } = useUser();

    const companyDetails = ref({
      name: 'Vue Storefront',
      street: 'Przeskok 2, 00-032',
      city: 'Warsaw, Poland',
      email: 'demo@vuestorefront.io'
    });

    const orderNumber = computed(() => order.value?.code);
    const orderDetails = computed(() => {
      const {
        firstName,
        lastName,
        formattedAddress
      } = order.value?.deliveryAddress || {};

      return {
        name: `${firstName} ${lastName}`,
        formattedAddress,
        status: order.value?.statusDisplay,
        created: order.value?.created,
        guestCustomer: order.value?.guestCustomer
      };
    });

    onMounted(async () => {
      await load({ code: route.value.query.order });
    });

    return {
      companyDetails,
      orderNumber,
      orderDetails,
      isAuthenticated
    };
  }
};
</script>
<style lang="scss" scoped>
.thank-you {
  @include for-desktop {
    max-width: 1272px;
  }

  &__banner {
    --call-to-action-color: var(--c-text);
    --call-to-action-text-container-width: 50%;
    @include for-desktop {
      margin: 0 0 var(--spacer-xl) 0;
    }
  }
  &__summary {
    margin-bottom: var(--spacer-sm);
    background: var(--c-light);
    @include for-desktop {
      display: flex;
    }
    &__heading {
      margin-bottom: var(--spacer-base);
    }
  }
  &__contact {
    padding: var(--spacer-sm);
    @include for-desktop {
      max-width: 50%;
      padding: var(--spacer-xl) var(--spacer-xl) var(--spacer-xl) var(--spacer-2xl);
    }
  }
  &__create-account {
    padding: var(--spacer-sm);
    @include for-mobile {
      background: white;
    }
    @include for-desktop {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: var(--spacer-xl) var(--spacer-2xl) var(--spacer-xl) var(--spacer-xl);
    }
  }
  &__back-button {
    --button-width: calc(100% - 2 * var(--spacer-sm));
    margin: 0 auto;
    @include for-desktop {
      margin: var(--spacer-xl) auto;
      --button-width: 25rem;
    }
  }
}

::v-deep .sf-heading__description {
  margin-top: var(--spacer-sm);
  color: var(--c-link);
  font-weight: var(--font-weight--light);
  font-family: var(--font-family--primary);
  @include for-desktop {
    font-size: var(--font-size--sm);
  }
  p {
    margin: 0;
  }
}
</style>
