import { clearElement } from './dom-util.js';

export function addPlace(container, place, biomes) {
  if(container.dataset && container.dataset.empty) {
    clearElement(container);
    delete container.dataset.empty;
  }
  container.append(renderPlace(place, biomes));
}

export function refreshPlaces(container, places, biomes) {
  clearElement(container);
  if(places.length == 0) {
    container.dataset.empty = true;
    container.append(createEmptyPlace());
  } else {
    container.append(renderPlaces(places, biomes));
  }
}

export function getPlace(form) {
  const y = form['place-y'].value || '~';
  return {
    title: form['place-title'].value,
    xyz: `${form['place-x'].value} ${y} ${form['place-z'].value}`,
    biome: form['place-biome'].value
  };
}

// helpers

function renderPlaces(places, biomes) {
  const frag = document.createDocumentFragment();
  for(const place of places) {
    addPlace(frag, place, biomes);
  }
  return frag;
}

function renderPlace(place, biomes) {
  const row = document.createElement('tr');
  row.insertCell().append(place.title);
  row.insertCell().append(place.xyz);
  row.insertCell().append(createBiomeTag(biomes[place.biome]));
  return row;
}

function createEmptyPlace() {
  const row = document.createElement('tr');
  const empty = row.insertCell();
  empty.addAttribute('colspan', 3);
  empty.classList.add('text-muted');
  empty.append('No places yet.');
  return row;
}

function createBiomeTag(biome) {
  const frag = document.createDocumentFragment();
  const icon = document.createElement('span');
  icon.classList.add('icon', 'mr-3');
  icon.style.backgroundPosition = biome.icon;
  icon.title = biome.name;
  frag.append(icon);
  frag.append(biome.name);
  return frag;
}
