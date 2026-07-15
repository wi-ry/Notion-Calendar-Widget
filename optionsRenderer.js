const rememberBoundsCheckbox = document.getElementById('remember-bounds');
const openAtLoginCheckbox = document.getElementById('open-at-login');
const saveButton = document.getElementById('save-btn');
const resetButton = document.getElementById('reset-btn');
const cancelButton = document.getElementById('cancel-btn');
const status = document.getElementById('status');

function setStatus(message) {
  status.textContent = message;
}

async function loadOptions() {
  const options = await window.optionsAPI.getOptions();
  rememberBoundsCheckbox.checked = Boolean(options.rememberWindowBounds);
  openAtLoginCheckbox.checked = Boolean(options.openAtLogin);
}

saveButton.addEventListener('click', async () => {
  await window.optionsAPI.saveOptions({
    rememberWindowBounds: rememberBoundsCheckbox.checked,
    openAtLogin: openAtLoginCheckbox.checked,
  });

  setStatus('Saved.');
  setTimeout(() => {
    window.optionsAPI.closeWindow();
  }, 350);
});

resetButton.addEventListener('click', async () => {
  const options = await window.optionsAPI.resetOptions();
  rememberBoundsCheckbox.checked = Boolean(options.rememberWindowBounds);
  openAtLoginCheckbox.checked = Boolean(options.openAtLogin);
  setStatus('Reset to defaults.');
});

cancelButton.addEventListener('click', () => {
  window.optionsAPI.closeWindow();
});

window.addEventListener('DOMContentLoaded', () => {
  loadOptions().catch(() => {
    setStatus('Failed to load options.');
  });
});
