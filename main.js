import Storage from './Storage.js';
import Places from './Places.js';
import PlaceUI from './PlaceUI.js';
import {loadJSON, downloadJSON, createUploader} from './file-io.js';
import {upgradePlaces} from './upgrade-places.js';
import {
  initImportModal,
  initResetModal,
  initUpdateModal,
} from './init-modals.js';

window.addEventListener('DOMContentLoaded', async () => {
  const storage = new Storage();
  const biomes = await loadJSON('biomes.json');
  const biomeSelect = createBiomeSelect(biomes);
  document.getElementById('place-biome').replaceWith(biomeSelect);

  updateBiomeIcon(biomeSelect.value, '#biome-select-icon', biomes);
  biomeSelect.addEventListener('change', (event) => {
    updateBiomeIcon(event.target.value, '#biome-select-icon', biomes);
  });

  const container = document.getElementById('places-container');
  const placeUI = new PlaceUI(document.querySelector('form'), biomes);
  placeUI.form.addEventListener('reset', () => {
    updateBiomeIcon('', '#biome-select-icon', biomes);
  });
  const places = new Places(container, placeUI, biomes, storage);
  places.refresh();

  new ClipboardJS('#places-container .btn[data-clipboard-text]');

  const uploader = createUploader('#places-uploader', (event) => {
    let data = JSON.parse(event.target.result);
    if (Array.isArray(data)) data = {places: data};

    places.cache = upgradePlaces(data);
    places.refresh();
  });

  document.getElementById('export').addEventListener('click', () => {
    // TODO: kamoroso94 - wait for `window.showSaveFilePicker` support
    downloadJSON(places.cache, 'places.json');
  });

  placeUI.form.querySelector('fieldset').disabled = false;

  initImportModal('import-modal', places, uploader);
  initResetModal('reset-modal', places);
  initUpdateModal('update-modal', storage);
});

function createBiomeSelect(biomes) {
  const select = document.createElement('select');
  select.classList.add('custom-select');
  select.id = 'place-biome';

  Object.entries(biomes)
    .sort(([, {name: a}], [, {name: b}]) => a.localeCompare(b))
    .forEach(([index, {id, name}]) => {
      const option = document.createElement('option');
      option.setAttribute('name', id);
      option.setAttribute('value', index);
      option.append(name);
      select.add(option);
    });

  const unknown = select.namedItem('unknown');
  unknown.selected = true;
  select.prepend(unknown);

  return select;
}

function updateBiomeIcon(biomeId, selector, biomes) {
  const biome = biomes[biomeId];
  const biomeIcon = document.querySelector(selector);
  biomeIcon.style.backgroundPosition = biome.icon;
  biomeIcon.title = biome.name;
}
