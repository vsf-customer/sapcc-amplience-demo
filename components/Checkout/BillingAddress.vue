<template>
  <div @click="onAddressClicked($event)">
    <SfAddress :name="addressName">
      <SfProperty :name="$t('Title')" :value="titleCode" />
      <SfProperty :name="$t('First name')" :value="firstName" />
      <SfProperty :name="$t('Last name')" :value="lastName" />
      <SfProperty :name="$t('Street')" :value="line1" />
      <SfProperty :name="$t('Apartment')" :value="line2" />
      <SfProperty :name="$t('City')" :value="town" />
      <SfProperty v-if="district" :name="$t('State')" :value="district" />
      <SfProperty v-if="country" :name="$t('Country')" :value="country.name" />
      <SfProperty :name="$t('Postal Code')" :value="postalCode" />
      <SfProperty v-if="phone" :name="$t('Phone')" :value="phone" />
    </SfAddress>
  </div>
</template>

<script>
import { SfProperty, SfAddressPicker } from '@storefront-ui/vue';

export default {
  name: 'BillingAddress',
  components: {
    SfProperty,
    SfAddressPicker
  },
  setup(props, context) {
    const address = context?.attrs?.address || {};
    const {
      firstName,
      lastName,
      line1,
      line2,
      town,
      district,
      country,
      postalCode,
      phone,
      titleCode
    } = address;

    const addressName = context?.attrs?.name;

    const onAddressClicked = (event) => {
      context.emit('click', event);
    };

    return {
      address,
      firstName,
      lastName,
      line1,
      line2,
      town,
      district,
      country,
      postalCode,
      phone,
      titleCode,
      addressName,
      onAddressClicked
    };
  }
};
</script>
