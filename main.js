import Storage from './Storage.js';
import Places from './Places.js';
import { loadJSON, downloadJSON, createUploader } from './file-io.js';
import { initImportModal, initResetModal, initDeleteModal, initUpdateModal } from './init-modals.js';

window.addEventListener('DOMContentLoaded', async () => {
  const storage = new Storage();
  const biomes = await loadJSON('biomes.json');
  document.getElementById('place-biome').replaceWith(createBiomeSelect(biomes));

  const container = document.getElementById('places-container');
  const places = new Places(storage, container, biomes);
  places.refresh();

  const clipboard = new ClipboardJS('#places-container .btn .fa-copy', {
    target(trigger) {
      return trigger.closest('tr').cells[1];
    }
  });

  const uploader = createUploader('#places-uploader', (event) => {
    places.cache = JSON.parse(event.target.result);
    places.refresh();
  });

  document.getElementById('export').addEventListener('click', () => {
    downloadJSON(places.cache, 'places.json');
  });

  const placeForm = document.querySelector('form');
  placeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    places.add(getPlace(placeForm));
  });

  placeForm.querySelector('fieldset').disabled = false;

  initImportModal('import-modal', places, uploader);
  initResetModal('reset-modal', places);
  initDeleteModal('delete-modal', places);
  initUpdateModal('update-modal', storage);
});

function createBiomeSelect(biomes) {
  const select = document.createElement('select');
  select.setAttribute('id', 'place-biome');
  select.classList.add('custom-select');

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
  unknown.setAttribute('selected', true);
  select.prepend(unknown);

  return select;
}

function getPlace(form) {
  const y = form['place-y'].value || '~';
  return {
    title: form['place-title'].value,
    xyz: `${form['place-x'].value} ${y} ${form['place-z'].value}`,
    biome: form['place-biome'].value
  };
}
