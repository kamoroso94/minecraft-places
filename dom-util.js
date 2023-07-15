export function clearElement(elem) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

export function createIconButton(name, variant) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn');
  button.classList.toggle(`btn-${variant}`, variant != null);

  const icon = document.createElement('span');
  icon.classList.add('fas', `fa-${name}`);
  button.append(icon);

  return button;
}

export function createBiomeTag(biome) {
  const frag = document.createDocumentFragment();
  const icon = document.createElement('span');
  icon.classList.add('biome-icon', 'mr-2');
  icon.style.backgroundPosition = biome.icon;
  icon.title = biome.name;
  frag.append(icon);
  frag.append(biome.name);
  return frag;
}
