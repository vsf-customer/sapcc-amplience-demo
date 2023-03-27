import { Address, Country } from '@vsf-enterprise/sap-commerce-webservices-sdk';

export interface BillingForm {
  firstName?: string;
  lastName?: string;
  streetName?: string;
  apartment?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  titleCode?: string;
}

export interface MapAddressProps {
  data: BillingForm;
  countries: Array<Country>;
}

export interface AddAddressProps extends MapAddressProps {
  name: string;
}

export interface AddShippingAddressProps {
  name: string;
  data: Address;
}
