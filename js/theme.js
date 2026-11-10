(function () {
  'use strict';
  var key = 'go-theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = 'system';
  try { preference = localStorage.getItem(key) || 'system'; } catch (_) {}
  if (!['system', 'light', 'dark'].includes(preference)) preference = 'system';
  function apply() {
    document.documentElement.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.themePreference = preference;
  }
  apply();
  media.addEventListener('change', apply);
  window.addEventListener('storage', function (event) {
    if (event.key !== key) return;
    preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : 'system';
    apply();
    var select = document.getElementById('theme-select');
    if (select) select.value = preference;
  });
  document.addEventListener('DOMContentLoaded', function () {
    var select = document.getElementById('theme-select');
    if (!select) return;
    select.value = preference;
    select.addEventListener('change', function () {
      preference = select.value;
      try { localStorage.setItem(key, preference); } catch (_) {}
      apply();
    });
  });
})();
