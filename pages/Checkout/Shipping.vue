<template>
  <div class="shipping" ref="scrollAnchor">
    <SfHeading
      class="shipping__title sf-heading--left sf-heading--no-underline"
      data-testid="shipping-header"
      :level="3"
      :title="$t('Shipping details')"
    />
    <template v-if="isAddressManagerVisible">
      <UserAddresses
        class="shipping__address-manager"
        :current-address="cartDeliveryAddress"
        :should-use-default-address="!Boolean(cartDeliveryAddress)"
        @change-address="onSavedAddressClick"
      />
      <SfButton
        class="shipping__add-address-button"
        @click="toggleAddressForm"
      >
        {{ $t('Add new address') }}
      </SfButton>
    </template>
    <template v-else>
      <AddressForm
        :initial-address="defaultFormAddress"
        @submit="onAddressFormSubmit"
      >
        <template #buttons>
          <SfButton
            v-if="!isDeliveryManagerVisible"
            v-e2e="'select-shipping'"
            class="form__action-button"
            type="submit"
            :disabled="cartAddressesLoading.create"
          >
            {{ $t('Select delivery mode') }}
          </SfButton>
          <SfButton
            v-if="canShowAddressManager"
            class="color-secondary"
            @click="toggleAddressForm"
          >
            {{ $t('Use existing address') }}
          </SfButton>
        </template>
      </AddressForm>
    </template>
    <DeliveryModes
      v-if="isDeliveryManagerVisible"
      @submit="selectDeliveryMode($event)"
    />
  </div>
</template>

<script>
import AddressForm from '~/components/AddressForm';
import UserAddresses from '~/components/Checkout/UserAddresses';
import { SfHeading, SfButton } from '@storefront-ui/vue';
import { computed, ref, useRouter, watch, useContext } from '@nuxtjs/composition-api';
import { ANONYMOUS_USER } from '@vsf-enterprise/sapcc-api';
import { useCart, useCartAddresses, useCartDeliveryModes, useUser, useUserAddresses } from '@vsf-enterprise/sapcc';

export default {
  name: 'Shipping',
  components: {
    SfHeading,
    SfButton,
    AddressForm,
    UserAddresses,
    DeliveryModes: () => import('~/components/Checkout/DeliveryModes')
  },
  setup() {
    const { localePath, $scrollTo } = useContext();
    const router = useRouter();
    const { cart } = useCart('main');
    const { create, replace, loading: cartAddressesLoading } = useCartAddresses('main');
    const { set: setDeliveryMode } = useCartDeliveryModes('main');
    const { isAuthenticated } = useUser();
    const { addresses, load: loadUserAddresses } = useUserAddresses();

    const isEditingAddress = ref(false);
    const scrollAnchor = ref(null);

    const cartDeliveryAddress = computed(() => cart.value?.deliveryAddress);
    const defaultFormAddress = computed(() => isAuthenticated.value ? null : cartDeliveryAddress.value);
    const userHasAddresses = computed(() => addresses.value.length);
    const isGuestCheckout = computed(() => cart.value?.user.uid === ANONYMOUS_USER);
    const canShowAddressManager = computed(() => isAuthenticated.value && cart.value && userHasAddresses.value && !isGuestCheckout.value);
    const isAddressManagerVisible = computed(() => canShowAddressManager.value && !isEditingAddress.value);
    const isDeliveryManagerVisible = computed(() => cartDeliveryAddress.value && !isEditingAddress.value);

    const toggleAddressForm = () => {
      isEditingAddress.value = !isEditingAddress.value;
      $scrollTo(scrollAnchor.value, 500);
    };
    const onSavedAddressClick = async (address) => {
      const { id: addressId } = address;
      await replace({ addressId });
    };
    const onAddressFormSubmit = async (address) => {
      await create({ address });
      if (isAuthenticated.value) await loadUserAddresses();
      if (canShowAddressManager.value) isEditingAddress.value = false;
    };
    const selectDeliveryMode = async (deliveryModeId) => {
      await setDeliveryMode({ deliveryModeId });
      router.push(localePath({ name: 'payment' }));
    };

    watch(isAuthenticated, async () => {
      if (isAuthenticated.value) await loadUserAddresses();
    }, { immediate: true });

    return {
      scrollAnchor,
      canShowAddressManager,
      isAddressManagerVisible,
      isDeliveryManagerVisible,
      cartDeliveryAddress,
      defaultFormAddress,
      onSavedAddressClick,
      onAddressFormSubmit,
      selectDeliveryMode,
      toggleAddressForm,
      cartAddressesLoading
    };
  }
};
</script>

<style lang="scss" scoped>
.shipping {
  @include for-mobile {
    --button-width: 100%;
  }
  &__title {
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  }
  &__add-address-button {
    margin-top: var(--spacer-sm);
    margin-bottom: var(--spacer-xl);
  }
}
</style>
