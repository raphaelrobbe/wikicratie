export const getContraintesMdpNonRespectees = (pwd: string): string[] => {
  const ret: string[] = [];
  if (!pwd.match(/[0-9]/g)) {
    ret.push(`contenir un chiffre`);
  }
  if (!pwd.match(/[A-Z]/g)) {
    ret.push(`contenir une lettre majuscule`);
  }
  if (!pwd.match(/[a-z]/g)) {
    ret.push(`contenir une lettre minuscule`);
  }
  if (!pwd.match(/[^a-zA-Z\d]/g)) {
    ret.push(`contenir un caractère spécial`);
  }
  if (pwd.length < 8) {
    ret.push(`contenir au moins 8 caractères`);
  }
  return ret;
}
