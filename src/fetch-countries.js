
export default function fetchCountries(name) {
   return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,flags,languages,population,capital`);
};