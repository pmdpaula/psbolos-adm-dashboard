export function randomCuid2() {
  const timestamp = Date.now().toString(36);
  const randomPart = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 36).toString(36),
  ).join("");
  return timestamp + randomPart;
}

export function transformExpiresTextInSeconds(expiresIn: string): number {
  const value = expiresIn.substring(0, expiresIn.length - 1);
  const unit = expiresIn.substring(expiresIn.length - 1); // s, m, h, d
  const numberValue = Number(value);

  switch (unit) {
    case "s":
      return numberValue;
    case "m":
      return numberValue * 60;
    case "h":
      return numberValue * 60 * 60;
    case "d":
      return numberValue * 60 * 60 * 24;
    default:
      throw new Error("Invalid expires in unit");
  }
}
