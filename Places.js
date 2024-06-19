import {clearElement, createIconButton, createBiomeTag} from './dom-util.js';
import {createDefaultPlaces, upgradePlaces} from './upgrade-places.js';

export default class Places {
  constructor(container, placeUI, biomes, storage) {
    this.container = container;
    this.placeUI = placeUI;
    this.biomes = biomes;
    this.storage = storage;

    let data = storage.get('places') ?? createDefaultPlaces();
    if (Array.isArray(data)) data = {places: data};

    this.cache = upgradePlaces(data);

    placeUI.addEventListener('add', (event) => this.add(event.detail.place));
    placeUI.addEventListener('edit', (event) => {
      const {place, index} = event.detail;
      this.replace(index, place);
    });

    this.moveUp = (event) => {
      const row = event.target.closest('tr');
      const rowAbove = row.previousElementSibling;
      if (!rowAbove) return;

      const index = row.rowIndex - 1;
      arraySwap(index, index - 1, this.cache.places);
      this.storage.set('places', this.cache);
      rowAbove.before(row);
    };
    this.moveDown = (event) => {
      const row = event.target.closest('tr');
      const rowBelow = row.nextElementSibling;
      if (!rowBelow) return;

      const index = row.rowIndex - 1;
      arraySwap(index, index + 1, this.cache.places);
      this.storage.set('places', this.cache);
      rowBelow.after(row);
    };
    this.edit = (event) => {
      const row = event.target.closest('tr');
      const index = row.rowIndex - 1;
      this.placeUI.renderEdit(this.cache.places[index], index);
    };
    this.remove = (event) => {
      const row = event.target.closest('tr');
      const index = row.rowIndex - 1;
      this.cache.places.splice(index, 1);
      this.storage.set('places', this.cache);
      row.remove();

      if (this.container.childElementCount === 0) {
        this.container.append(createEmptyPlace());
      }
    };
  }

  refresh() {
    this.storage.set('places', this.cache);
    clearElement(this.container);

    const content = !this.isEmpty() ? renderPlaces(this) : createEmptyPlace();
    this.container.append(content);
  }

  add(place) {
    this.cache.places.push(place);
    this.storage.set('places', this.cache);

    if (this.container.firstElementChild.dataset.empty) {
      clearElement(this.container);
    }
    this.container.append(renderPlace(this.size() - 1, this));
  }

  replace(index, place) {
    this.cache.places[index] = place;
    this.storage.set('places', this.cache);
    const placeRow = renderPlace(index, this);
    this.container.children[index].replaceWith(placeRow);
  }

  isEmpty() {
    return this.cache.places.length === 0;
  }

  clear() {
    this.cache.places = [];
    this.refresh();
  }

  item(index) {
    return this.cache.places[index];
  }

  size() {
    return this.cache.places.length;
  }
}

function createEmptyPlace() {
  const row = document.createElement('tr');
  const empty = row.insertCell();
  empty.setAttribute('colspan', 4);
  empty.classList.add('text-muted');
  empty.dataset.empty = true;
  empty.append('No places yet.');
  return row;
}

function renderPlaces(places) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < places.size(); i++) {
    frag.append(renderPlace(i, places));
  }
  return frag;
}

function renderPlace(index, places) {
  const place = places.item(index);
  const row = document.createElement('tr');
  const title = document.createElement('th');
  title.setAttribute('scope', 'row');
  title.append(place.title);
  row.append(title);
  row.insertCell().append(place.xyz);
  row.insertCell().append(createBiomeTag(places.biomes[place.biome]));
  row.insertCell().append(createOptions(index, places));
  return row;
}

function createOptions(index, places) {
  const place = places.item(index);

  const group = document.createElement('div');
  group.classList.add('btn-group');

  const upButton = createIconButton('chevron-up');
  upButton.title = 'Move up';
  upButton.addEventListener('click', places.moveUp);
  const downButton = createIconButton('chevron-down');
  downButton.title = 'Move down';
  downButton.addEventListener('click', places.moveDown);
  const copyButton = createIconButton('copy');
  copyButton.dataset.clipboardText = place.xyz;
  copyButton.title = 'Copy';
  const editButton = createIconButton('edit');
  editButton.title = 'Edit';
  editButton.addEventListener('click', places.edit);
  const deleteButton = createIconButton('trash', 'danger');
  deleteButton.title = 'Delete';
  deleteButton.addEventListener('click', places.remove);
  group.append(upButton, downButton, copyButton, editButton, deleteButton);

  return group;
}

function arraySwap(i, j, array) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
