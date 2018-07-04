export function clearElement(elem) {
  while(elem.firstChild) {
    elem.firstChild.remove();
  }
}

export function setAttributes(elem, attributes) {
  for(const attr in attributes) {
    elem.setAttribute(attr, attributes[attr]);
  }
}

export function createIconButton(name, variant='light') {
  const button = document.createElement('button');
  setAttributes(button, {
    'type': 'button',
    'class': `btn btn-${variant}`
  });

  const icon = document.createElement('span');
  icon.classList.add('fas', `fa-${name}`);
  button.append(icon);

  return button;
}
