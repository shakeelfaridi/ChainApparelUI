/**
 * Get theme from localstorage
 * @return string
 */
export default function SwitchTheme() {
    const theme = localStorage.getItem('theme');
    let setTheme = 'ewiseTheme';
    switch (theme) {
      case 'ewise':
        setTheme = 'ewiseTheme';
        break;
      case 'po':
        setTheme = 'poTheme';
        break;
      case 'pe':
        setTheme = 'peTheme';
        break;
      case 'cme':
        setTheme = 'cmeTheme';
        break;
      default:
    }
    return setTheme;
}