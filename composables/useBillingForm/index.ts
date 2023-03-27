/* eslint-disable dot-notation */
import { sharedRef } from '@vue-storefront/core';
import {
  AddAddressProps,
  AddShippingAddressProps,
  MapAddressProps
} from '~/types';
import { Address } from '@vsf-enterprise/sap-commerce-webservices-sdk';
import { BILLING_FORM_ADDRESS_NAME } from '~/helpers/constants';
import { PaymentEntry } from '@vsf-enterprise/sapcc-api';
import { convertToMap } from '~/helpers/convertToMap';

export const useBillingForm = () => {
  const selectedAddressName = sharedRef<string>(
    null,
    'billing-selected-address-name'
  );
  const selectedAddress = sharedRef<Address>(null, 'billing-selected-address');
  const billingAddress = sharedRef({}, 'billing-addresses');
  const shippingAddress = sharedRef({}, 'shipping-addresses');

  const mapAddress = ({ data, countries }: MapAddressProps) => {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      line1: data.streetName,
      line2: data.apartment,
      town: data.city,
      district: data.state,
      country: {
        isocode: data.country,
        name: countries.find((country) => data.country === country.isocode)
          ?.name
      },
      postalCode: data.postalCode,
      phone: data.phone,
      titleCode: data.titleCode
    };
  };

  const addBillingAddress = (data: AddAddressProps) => {
    billingAddress.value = mapAddress(data);
    console.log(billingAddress.value);
  };

  const addShippingAddress = ({ data }: AddShippingAddressProps) => {
    shippingAddress.value = data;
  };

  const selectAddress = (name: BILLING_FORM_ADDRESS_NAME) => {
    switch (name) {
      case BILLING_FORM_ADDRESS_NAME.BILLING:
        selectedAddress.value = billingAddress.value;
        break;
      case BILLING_FORM_ADDRESS_NAME.SHIPPING:
        selectedAddress.value = shippingAddress.value;
        break;
    }
    selectedAddressName.value = name;
  };

  const isShippingAddress = () => {
    return selectedAddressName.value === BILLING_FORM_ADDRESS_NAME.SHIPPING;
  };

  const changeBillingDataForPaymentProvider = (
    entries: PaymentEntry[]
  ): PaymentEntry[] => {
    const entriesMap = convertToMap(entries);
    entriesMap['billTo_city'] = selectedAddress.value.town;
    entriesMap['billTo_country'] = selectedAddress.value.country.isocode;
    entriesMap['billTo_lastName'] = selectedAddress.value.lastName;
    entriesMap['billTo_street2'] = selectedAddress.value.line2;
    entriesMap['billTo_street1'] = selectedAddress.value.line1;
    entriesMap['billTo_firstName'] = selectedAddress.value.firstName;
    entriesMap['billTo_postalCode'] = selectedAddress.value.postalCode;

    return Object.entries(entriesMap).map(([key, value]) => ({ key, value }));
  };

  return {
    selectedAddress,
    selectedAddressName,
    billingAddress,
    shippingAddress,
    isShippingAddress,
    addBillingAddress,
    addShippingAddress,
    selectAddress,
    changeBillingDataForPaymentProvider
  };
};
