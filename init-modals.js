export function initImportModal(id, places, uploader) {
  $(`#${id}`).on('show.bs.modal', (event) => {
    if(!places.isEmpty()) return;
    event.preventDefault();
    uploader.click();
  });

  const importModalButton = document.getElementById(`${id}-btn`);
  importModalButton.addEventListener('click', () => uploader.click());
}

export function initResetModal(id, places) {
  $(`#${id}`).on('show.bs.modal', (event) => {
    if(!places.isEmpty()) return;
    event.preventDefault();
  });

  const resetModalButton = document.getElementById(`${id}-btn`);
  resetModalButton.addEventListener('click', () => places.clear());
}

export function initUpdateModal(id, storage) {
  const currentVersion = document.head.querySelector('meta[name="version"]').content;
  const cachedVersion = storage.get('version') || '';

  storage.set('version', currentVersion);
  document.getElementById(`${id}-version`).textContent = currentVersion;

  const trigger = document.querySelector(`[data-target="#${id}"]`);
  const updateIcon = trigger.querySelector('.fa-gift');
  trigger.addEventListener('click', () => {
    storage.set('update-seen', true);
    updateIcon.classList.remove('wiggle');
  });

  // e.g., in version A.B, tease if B has changed
  // i.e, don't care about upgrading from 1.1 to 1.1.1
  if(compareVersions(currentVersion, cachedVersion, 2) > 0) {
    storage.set('update-seen', false);
  }
  updateIcon.classList.toggle('wiggle', !storage.get('update-seen'));
}

function compareVersions(ver1, ver2, maxLen) {
  const parseVersion = v => v.split('.', maxLen).map(x => +x);
  const ver1Arr = parseVersion(ver1);
  const ver2Arr = parseVersion(ver2);

  const len = Math.max(ver1Arr.length, ver2Arr.length);
  for(let i = 0; i < len; i++) {
    if(i == ver1Arr.length) return -1;
    if(i == ver2Arr.length) return 1;
    if(ver1Arr[i] < ver2Arr[i]) return -1;
    if(ver1Arr[i] > ver2Arr[i]) return 1;
  }

  return 0;
}
