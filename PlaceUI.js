export default class PlaceUI extends EventTarget {
  constructor(form, biomes) {
    super();
    this.form = form;
    this.title = form.querySelector('h3');
    this.submitBtn = form['place-btn-submit'];
    this.secondBtn = form['place-btn-secondary'];
    this.mode = 'add';
    this.biomes = biomes;

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const place = getPlace(this.form);
      const detail = {
        place,
        index: this.form.dataset.index,
      };
      const placeFormEvent = new CustomEvent(this.mode, {detail});
      this.dispatchEvent(placeFormEvent);
      this.renderAdd();
    });

    this.secondBtn.addEventListener('click', () => {
      if (this.mode === 'add') {
        this.form.reset();
      } else {
        this.renderAdd();
      }
    });
  }

  renderAdd() {
    this.mode = 'add';
    delete this.form.dataset.index;
    this.form.reset();
    this.title.textContent = 'Add New Place';

    this.submitBtn.textContent = 'Add';
    this.secondBtn.textContent = 'Clear';
  }

  renderEdit(place, index) {
    this.mode = 'edit';
    this.form.dataset.index = index;
    this.title.textContent = 'Edit Place';

    this.form['place-title'].value = place.title;

    const [x, y, z] = parseXYZ(place.xyz);
    this.form['place-x'].value = x;
    this.form['place-y'].value = y;
    this.form['place-z'].value = z;

    const biomeName = this.biomes[place.biome].id;
    this.form['place-biome'].namedItem(biomeName).selected = true;

    this.submitBtn.textContent = 'Save';
    this.secondBtn.textContent = 'Cancel';

    this.title.scrollIntoView({block: 'start', behavior: 'smooth'});
    this.form['place-title'].focus();
  }
}

function getPlace(form) {
  const y = form['place-y'].value || '~';
  return {
    title: form['place-title'].value,
    xyz: `${form['place-x'].value} ${y} ${form['place-z'].value}`,
    biome: form['place-biome'].value,
  };
}

function parseXYZ(xyz) {
  return xyz.split(' ').map((x) => (x !== '~' ? x : ''));
}
