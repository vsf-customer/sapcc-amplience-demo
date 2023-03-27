import { PaymentEntry } from '@vsf-enterprise/sapcc-api';

export function convertToMap(
  paramList: PaymentEntry[]
): Record<string, string | undefined> {
  return paramList.reduce(
    (result: Record<string, string | undefined>, item) => {
      const key = item.key;
      result[key] = item.value;
      return result;
    },
    {}
  );
}
