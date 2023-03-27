<template>
  <transition name="fade">
    <SfTabs
      v-if="edittingAddress"
      key="edit-address"
      :open-tab="1"
      class="tab-orphan"
    >
      <SfTab :title="isNewAddress ? 'Add the address' : 'Update the address'">
        <MyAccountHeading>
          {{ $t('User address updated') }}
        </MyAccountHeading>

        <UserAddressForm
          :address="activeAddress"
          :isNew="isNewAddress"
          @submit="saveAddress"
          @cancel="cancel"
        />
      </SfTab>
    </SfTabs>

    <SfTabs v-else :open-tab="1" key="address-list" class="tab-orphan">
      <SfTab :title="$t('My Addresses')">
        <MyAccountHeading>
          {{ $t('Manage user addresses') }}
        </MyAccountHeading>

        <transition-group tag="div" name="fade" class="shipping-list">
          <div
            v-for="address in addresses"
            :key="userShippingGetters.getId(address)"
            class="shipping"
          >
            <div class="shipping__content">
              <div class="shipping__address">
                <UserAddress :address="address" />
              </div>
            </div>
            <div class="shipping__actions">
              <SfIcon
                icon="cross"
                color="gray"
                size="14px"
                role="button"
                class="smartphone-only"
                @click="removeAddress(address)"
              />
              <SfButton @click="changeAddress(address)">
                {{ $t('Change') }}
              </SfButton>

              <SfButton
                class="color-light shipping__button-delete desktop-only"
                @click="removeAddress(address)"
                :disabled="loading.deleteAddress"
              >
                {{ $t('Delete') }}
              </SfButton>
            </div>
          </div>
        </transition-group>
        <SfButton class="action-button" @click="changeAddress()">
          {{ $t('Add new address') }}
        </SfButton>
      </SfTab>
    </SfTabs>
  </transition>
</template>
<script>
import { SfTabs, SfButton, SfIcon } from '@storefront-ui/vue';
import UserAddress from '~/components/UserAddress';
import UserAddressForm from '~/components/MyAccount/UserAddressForm';
import { useUserAddresses, userShippingGetters, useCart } from '@vsf-enterprise/sapcc';
import { ref, computed, onMounted } from '@nuxtjs/composition-api';
import MyAccountHeading from '~/components/MyAccount/MyAccountHeading.vue';

export default {
  name: 'MyAddresses',
  components: {
    SfTabs,
    SfButton,
    SfIcon,
    UserAddress,
    UserAddressForm,
    MyAccountHeading
  },
  setup() {
    const { cart, load: reloadCart } = useCart('main');
    const {
      addresses,
      load: loadUserAddresses,
      addAddress,
      deleteAddress,
      updateAddress,
      error,
      loading
    } = useUserAddresses();

    const edittingAddress = ref(false);
    const activeAddress = ref(undefined);
    const isNewAddress = computed(() => !activeAddress.value);

    const changeAddress = (address = undefined) => {
      activeAddress.value = address;
      edittingAddress.value = true;
    };

    const removeAddress = async (address) => {
      const { id: addressId } = address;
      const isDeletingCartAddress = cart.value.deliveryAddress?.id === addressId;

      await deleteAddress({ addressId });
      if (isDeletingCartAddress) reloadCart();
    };

    const cancel = () => {
      edittingAddress.value = false;
      activeAddress.value = undefined;
    };

    const saveAddress = async ({ form, onComplete, onError }) => {
      try {
        const actionMethod = isNewAddress.value ? addAddress : updateAddress;
        const data = await actionMethod({ address: form });

        const currentError = isNewAddress.value
          ? error.value.addAddress
          : error.value.updateAddress;
        if (currentError) {
          onError(currentError);
          return;
        }

        cancel();
        await onComplete(data);
      } catch (error) {
        onError(error);
      }
    };

    onMounted(async () => {
      await loadUserAddresses();
    });

    return {
      changeAddress,
      updateAddress,
      removeAddress,
      saveAddress,
      userShippingGetters,
      addresses,
      edittingAddress,
      activeAddress,
      isNewAddress,
      cancel,
      loading
    };
  }
};
</script>

<style lang="scss" scoped>
@include sf-tab--orphan;
.shipping-list {
  margin-bottom: var(--spacer-base);
}
.shipping {
  display: flex;
  padding: var(--spacer-xl) 0;
  border-top: 1px solid var(--c-light);

  &:last-child {
    border-bottom: 1px solid var(--c-light);
  }
  &__content {
    flex: 1;
    color: var(--c-text);
    font-size: var(--font-size--base);
    font-weight: 300;
    line-height: 1.6;
  }
  &__actions {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    @include for-desktop {
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }
  &__button-delete {
    color: var(--c-link);
    @include for-desktop {
      margin-left: var(--spacer-base);
    }
  }
  &__address {
    margin: 0;
    p {
      margin: 0;
    }
  }
  &__client-name {
    font-size: var(--font-size--base);
    font-weight: 500;
  }
}
.action-button {
  width: 100%;
  @include for-desktop {
    width: auto;
  }
}
</style>
