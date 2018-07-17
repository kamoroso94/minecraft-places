import Storage from './Storage.js';
import Places from './Places.js';
import { loadJSON, downloadJSON, createUploader } from './file-io.js';

window.addEventListener('DOMContentLoaded', async () => {
  const biomes = await loadJSON('biomes.json');
  document.getElementById('place-biome').replaceWith(createBiomeSelect(biomes));

  const storage = new Storage();
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

  const placeForm = document.querySelector('form');
  placeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    places.add(getPlace(placeForm));
  });

  placeForm.querySelector('fieldset').disabled = false;

  $('#import-modal').on('show.bs.modal', (event) => {
    if(!places.isEmpty()) return;
    event.preventDefault();
    uploader.click();
  });
  const importModalButton = document.getElementById('import-modal-btn');
  importModalButton.addEventListener('click', () => uploader.click());

  document.getElementById('export').addEventListener('click', () => {
    downloadJSON(places.cache, 'places.json');
  });

  $('#reset-modal').on('show.bs.modal', (event) => {
    if(!places.isEmpty()) return;
    event.preventDefault();
  });
  const resetModalButton = document.getElementById('reset-modal-btn');
  resetModalButton.addEventListener('click', () => places.clear());

  const deleteModal = document.getElementById('delete-modal');
  $(deleteModal).on('show.bs.modal', (event) => {
    const title = document.getElementById('delete-place-title');
    const button = event.relatedTarget;
    const index = button.dataset.placeIndex;
    delete button.dataset.placeIndex;
    title.textContent = places.item(index).title;
    deleteModal.dataset.placeIndex = index;
  });
  const deleteModalButton = document.getElementById('delete-modal-btn');
  deleteModalButton.addEventListener('click', () => {
    const index = deleteModal.dataset.placeIndex;
    delete deleteModal.dataset.placeIndex;
    places.remove(index);
  });
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
