import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

export const phoneUtils = PhoneNumberUtil.getInstance();

export function toPhoneInternationalFormat(phone: string, defaultRegion: string) {
  try {
    const phoneNumber = phoneUtils.parse(phone, defaultRegion);
    return phoneUtils.format(phoneNumber, PhoneNumberFormat.INTERNATIONAL).replaceAll(" ", "");
  } catch {
    return phone;
  }
}

export function formatPhone(phone: string, format = PhoneNumberFormat.INTERNATIONAL) {
  try {
    if (!phone || !phone.startsWith("+")) {
      return phone;
    }
    const phoneNumber = phoneUtils.parse(phone, "ZZ");
    return phoneUtils.format(phoneNumber, format).replaceAll(" ", "");
  } catch {
    return phone;
  }
}
