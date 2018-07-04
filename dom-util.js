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
