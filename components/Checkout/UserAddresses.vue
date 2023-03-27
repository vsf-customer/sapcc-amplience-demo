<template>
  <div class="user-address-list">
    <SfAddressPicker
      :selected="currentAddress.id"
      @change="changeCurrentAddress($event)"
      class="user-address-list__addresses"
    >
      <SfAddress
        v-for="address in addresses"
        :key="address.id"
        :name="address.id"
        class="user-address-list__address"
      >
        <span>{{ address.title }} {{ address.firstName }} {{ address.lastName }}</span>
        <span>{{ address.line1 }} {{ address.line2 }}</span>
        <span>{{ address.postalCode }}</span>
        <span>{{ address.town }}</span>
        <span>{{ address.country.name }}</span>
        <span>{{ address.phone }}</span>
      </SfAddress>
    </SfAddressPicker>
  </div>
</template>

<script>
import { SfAddressPicker, SfHeading } from '@storefront-ui/vue';
import { useUserAddresses } from '@vsf-enterprise/sapcc';
import { onMounted, computed } from '@nuxtjs/composition-api';

export default {
  name: 'UserAddresses',
  props: {
    currentAddress: {
      type: Object,
      default: () => ({ id: '0' })
    },
    shouldUseDefaultAddress: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SfAddressPicker,
    SfHeading
  },
  setup (props, { emit }) {
    const { addresses } = useUserAddresses();

    const defaultAddress = computed(() => addresses.value.find(address => address.defaultAddress));

    const changeCurrentAddress = async (id) => {
      const selectedAddress = addresses.value.find(address => address.id === id);
      emit('change-address', selectedAddress);
    };

    onMounted(() => {
      if (props.shouldUseDefaultAddress) changeCurrentAddress(defaultAddress.value.id);
    });

    return { addresses, changeCurrentAddress };
  }
};
</script>

<style lang="scss" scoped>
.user-address-list {
  ::v-deep .sf-heading__description {
    margin-bottom: var(--spacer-xs);
    text-align: left;
  }
  &__addresses {
    @include for-desktop {
      display: flex;
      flex-wrap: wrap;
    }
  }
  &__address {
    margin-bottom: var(--spacer-xs);
    @include for-desktop {
      margin-right: var(--spacer-xs);
    }
  }
}
</style>
