export async function loadJSON(url) {
  const response = await fetch(url);
  return response.json();
}

export function downloadJSON(data, filename='data.json') {
  if(!filename.endsWith('.json')) filename += '.json';

  const aTag = document.createElement('a');
  aTag.setAttribute('download', filename);
  const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
  const url = window.URL.createObjectURL(blob);
  aTag.setAttribute('href', url);
  aTag.addEventListener('click', () => {
    setTimeout(window.URL.revokeObjectURL, 100, url);
  }, { once: true });
  aTag.click();
}

export function createUploader(selector, callback) {
  const uploader = document.querySelector(selector);

  uploader.addEventListener('change', (event) => {
    event.preventDefault();

    const reader = new FileReader();
    reader.addEventListener('load', callback);

    reader.readAsText(uploader.files[0]);
    uploader.value = null;  // enables event fire for reuploading same file
  });

  return uploader;
}
