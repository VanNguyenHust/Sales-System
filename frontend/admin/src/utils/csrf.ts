let csrf: string | undefined = undefined;

export function getCsrf() {
  return csrf;
}

export function setCsrf(value: string) {
  csrf = value;
}
