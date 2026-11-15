// XAMPP writes private daily .md files through PHP.
// For the public portfolio, set endpoint to the HTTPS URL of register.php on a PHP host.
// GitHub Pages cannot execute PHP or write these files.
(function () {
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  window.GO_VISITS = Object.freeze({ endpoint: local ? './services/visits/register.php' : '', allowLocal: local });
})();
