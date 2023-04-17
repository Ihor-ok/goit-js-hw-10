import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetch-countries';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearchBox, DEBOUNCE_DELAY));

function onSearchBox(evt) {
    
    if (evt.target.value === '') {
        cleanUpCountries();
        return;
    };

    let recordedValueOnSearchBox = evt.target.value.trim();

    if (recordedValueOnSearchBox.length > 0) {
        fetchCountries(recordedValueOnSearchBox).then(response => {
    if (!response.ok) {
        cleanUpCountries();
        throw new Error(response.status);
            };
    return response.json();
        }).then(getCounrys).catch(callWarning);
    };  
};

function getCounrys(countrys) {

    if (countrys.length >= 10) {
        cleanUpCountries();
        Notify.info('Too many matches found. Please enter a more specific name.');
    };

    if (countrys.length >= 2 && countrys.length <= 10) {
        cleanUpCountries();
        const markup = countrys.map((coyntry) => `<li class="list-item"><img src = "${coyntry.flags.svg}" alt="flags.svg" width="30" height="20"/><span class="main-country">${coyntry.name.common}</span></li>`).join("");
        refs.countryList.innerHTML = markup;
    };
    
    if (countrys.length === 1) {
        cleanUpCountries();
        const markup = countrys.map((coyntry) => `<div>
        <div><img src = "${coyntry.flags.svg}" alt="flags.svg" width="30" height="20"/><span class="main-country">${coyntry.name.common}</span></div>
        <div><span>Capital:</span><span class="characteristic">${coyntry.capital}</span></div>
        <div><span>Population:</span><span class="characteristic">${coyntry.population}</span></div>
        <div><span>Languages:</span><span class="characteristic">${Object.values(coyntry.languages)}</span></div>
        </div>`).join("");
        refs.countryInfo.innerHTML = markup;
    };
};

function callWarning() {
    Notify.failure('Oops, there is no country with that name');
};



function cleanUpCountries() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
};


