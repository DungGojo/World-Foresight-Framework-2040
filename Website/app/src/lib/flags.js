// ISO3 (the market codes used throughout the pipeline) -> ISO2, the filename
// convention of public/assets/flags (HatScripts circle-flags, MIT). Every one
// of the 34 markets has a file; anything else resolves to null so callers can
// fall back to a plain marker rather than requesting a 404.
import { asset } from './assets';

const ISO2 = {
  ARE: 'ae', ARG: 'ar', AUS: 'au', BGD: 'bd', BRA: 'br', CAN: 'ca', CHN: 'cn',
  COD: 'cd', DEU: 'de', EGY: 'eg', ETH: 'et', FRA: 'fr', GBR: 'gb', IDN: 'id',
  IND: 'in', IRN: 'ir', ISR: 'il', ITA: 'it', JPN: 'jp', KAZ: 'kz', KEN: 'ke',
  KOR: 'kr', MEX: 'mx', NGA: 'ng', NLD: 'nl', PAK: 'pk', POL: 'pl', RUS: 'ru',
  SAU: 'sa', TUR: 'tr', UKR: 'ua', USA: 'us', VNM: 'vn', ZAF: 'za',
};

export function flagSrc(market) {
  const code = ISO2[market];
  return code ? asset(`assets/flags/${code}.svg`) : null;
}
