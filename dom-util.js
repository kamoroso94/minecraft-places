export function clearElement(elem) {
  while(elem.firstChild) {
    elem.firstChild.remove();
  }
}
