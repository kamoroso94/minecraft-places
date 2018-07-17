import { clearElement, createIconButton, createBiomeTag } from './dom-util.js';

export default class Places {
  constructor(storage, container, biomes) {
    this.storage = storage;
    this.cache = storage.get('places') || [];
    this.biomes = biomes;
    this.container = container;

    this.moveUp = (event) => {
      const row = event.target.closest('tr');
      const rowAbove = row.previousElementSibling;
      if(!rowAbove) return;

      const index = row.rowIndex - 1;
      arraySwap(index, index - 1, this.cache);
      this.storage.set('places', this.cache);
      rowAbove.before(row);
    };
    this.moveDown = (event) => {
      const row = event.target.closest('tr');
      const rowBelow = row.nextElementSibling;
      if(!rowBelow) return;

      const index = row.rowIndex - 1;
      arraySwap(index, index + 1, this.cache);
      this.storage.set('places', this.cache);
      rowBelow.after(row);
    };
  }

  isEmpty() {
    return this.cache.length == 0;
  }

  clear() {
    this.cache = [];
    this.refresh();
  }

  item(index) {
    return this.cache[index];
  }

  size() {
    return this.cache.length;
  }

  refresh() {
    this.storage.set('places', this.cache);
    clearElement(this.container);

    const content = !this.isEmpty() ? renderPlaces(this) : createEmptyPlace();
    this.container.append(content);
  }

  add(place) {
    this.cache.push(place);
    this.storage.set('places', this.cache);

    if(this.container.firstElementChild.dataset.empty) {
      clearElement(this.container);
    }
    this.container.append(renderPlace(this.size() - 1, this));
  }

  remove(index) {
    this.cache.splice(index, 1);
    this.storage.set('places', this.cache);
    this.container.children[index].remove();

    if(this.container.childElementCount == 0) {
      this.container.append(createEmptyPlace());
    }
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
  for(let i = 0; i < places.size(); i++) {
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
  row.insertCell().append(createOptions(places.moveUp, places.moveDown));
  return row;
}

function createOptions(moveUp, moveDown) {
  const group = document.createElement('div');
  group.classList.add('btn-group');

  const upButton = createIconButton('chevron-up');
  upButton.title = "Move up";
  upButton.addEventListener('click', moveUp);
  const downButton = createIconButton('chevron-down');
  downButton.title = "Move down";
  downButton.addEventListener('click', moveDown);
  const copyButton = createIconButton('copy');
  copyButton.title = "Copy";
  const deleteButton = createIconButton('trash', 'danger');
  deleteButton.title = "Delete";
  deleteButton.addEventListener('click', alertRemove);
  group.append(upButton, downButton, copyButton, deleteButton);

  return group;
}

function alertRemove(event) {
  const row = event.target.closest('tr');
  const index = row.rowIndex - 1;
  this.dataset.placeIndex = index;
  $('#delete-modal').modal('show', this);
}

function arraySwap(i, j, array) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
