import Storage from './Storage.js';
import { addPlace, refreshPlaces, getPlace, createEmptyPlace } from './places.js';
import { loadJSON, downloadJSON, createUploader } from './file-io.js';
import { clearElement } from './dom-util.js';

window.addEventListener('DOMContentLoaded', async () => {
  const biomes = await loadJSON('biomes.json');
  document.getElementById('place-biome').replaceWith(createBiomeSelect(biomes));

  const storage = new Storage();
  const container = document.getElementById('places-container');
  let places = storage.get('places') || [];
  storage.set('places', places);
  refreshPlaces(container, places, biomes);

  const uploader = createUploader('#places-uploader', event => {
    places = JSON.parse(event.target.result);
    storage.set('places', places);
    refreshPlaces(container, places, biomes);
  });

  const placeForm = document.querySelector('form');
  placeForm.addEventListener('submit', event => {
    event.preventDefault();
    const place = getPlace(placeForm);

    places.push(place);
    storage.set('places', places);
    addPlace(container, place, biomes);
  });

  placeForm.querySelector('fieldset').removeAttribute('disabled');

  $('#import-modal').on('show.bs.modal', event => {
    if(places.length > 0) return;
    event.preventDefault();
    uploader.click();
  });
  const importModalButton = document.getElementById('import-modal-btn');
  importModalButton.addEventListener('click', () => uploader.click());

  document.getElementById('export').addEventListener('click', () => {
    downloadJSON(places, 'places.json');
  });

  $('#reset-modal').on('show.bs.modal', event => {
    if(places.length > 0) return;
    event.preventDefault();
  });
  const resetModalButton = document.getElementById('reset-modal-btn');
  resetModalButton.addEventListener('click', () => {
    places = [];
    storage.remove('places');
    clearElement(container);
    container.dataset.empty = true;
    container.append(createEmptyPlace());
  });
});

function createBiomeSelect(biomes) {
  const select = document.createElement('select');
  select.setAttribute('id', 'place-biome');
  select.classList.add('custom-select');

  for(const index in biomes) {
    const option = document.createElement('option');
    option.setAttribute('name', biomes[index].id);
    option.setAttribute('value', index);
    option.append(biomes[index].name);
    select.add(option);
  }

  const unknown = select.namedItem('unknown');
  unknown.setAttribute('selected', true);
  select.removeChild(unknown);
  select.prepend(unknown);

  return select;
}
