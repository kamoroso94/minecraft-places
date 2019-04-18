import Storage from './Storage.js';
import Places from './Places.js';
import PlaceUI from './PlaceUI.js';
import { loadJSON, downloadJSON, createUploader } from './file-io.js';
import { initImportModal, initResetModal, initUpdateModal } from './init-modals.js';

window.addEventListener('DOMContentLoaded', async () => {
  const storage = new Storage();
  const biomes = await loadJSON('biomes.json');
  document.getElementById('place-biome').replaceWith(createBiomeSelect(biomes));

  const container = document.getElementById('places-container');
  const placeUI = new PlaceUI(document.querySelector('form'), biomes);
  const places = new Places(container, placeUI, biomes, storage);
  places.refresh();

  const clipboard = new ClipboardJS('#places-container .btn[data-clipboard-text]');

  const uploader = createUploader('#places-uploader', (event) => {
    places.cache = JSON.parse(event.target.result);
    places.refresh();
  });

  document.getElementById('export').addEventListener('click', () => {
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
