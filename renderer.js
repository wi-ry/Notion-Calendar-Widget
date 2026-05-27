let isResizing = false;

function startResize(edge, event) {
  if (event.button !== 0) return;

  isResizing = true;
  window.electronAPI.beginResize(edge, event.screenX, event.screenY);
  event.preventDefault();
}

function onMouseMove(event) {
  if (!isResizing) return;
  window.electronAPI.updateResize(event.screenX, event.screenY);
}

function stopResize() {
  if (!isResizing) return;
  isResizing = false;
  window.electronAPI.endResize();
}

document.querySelectorAll('.resize-handle').forEach((handle) => {
  handle.addEventListener('mousedown', (event) => {
    startResize(handle.dataset.edge, event);
  });
});

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', stopResize);
window.addEventListener('blur', stopResize);

document.getElementById('refresh-btn').addEventListener('click', () => {
  window.electronAPI.refreshCalendar();
});

document.getElementById('options-btn').addEventListener('click', () => {
  window.electronAPI.openOptionsWindow();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});
