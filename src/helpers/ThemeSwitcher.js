/**
 * Define current theme and store it in localstorage
 * @return string
 */
export default function ThemeSwitcher() {
    const domain = window.location.hostname.match(/(\.cme-online.nl|\.pe-academy.nl|\.e-wise.nl|\.po-online.nl)/);
    let ewiseLabel = 'pe';
    if (domain && domain.length >= 2) {
      if (window.location.hostname.match(/(\.cme-online.nl)/)) {
        ewiseLabel = 'cme';
      }
      if (window.location.hostname.match(/(\.po-online.nl)/)) {
        ewiseLabel = 'po';
      }
      if (window.location.hostname.match(/(\.pe-academy.nl)/)) {
        ewiseLabel = 'pe';
      }
    }
    localStorage.setItem('theme', ewiseLabel); // Set localstorage
    return ewiseLabel;
}