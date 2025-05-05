const isUrlValid = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return true;
  } catch {
    /* empty */
  }
  return false;
};

export function validateRedirectUrl(msg: string) {
  return (input?: string) => {
    if (!input) {
      return;
    }

    const isValidUrl =
      (input.startsWith("/") && isUrlValid(`https://example.com${input}`)) ||
      (!input.startsWith("/") && isUrlValid(input));

    return !isValidUrl ? msg : undefined;
  };
}
