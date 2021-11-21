const setTheme = (themeName) => {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

const keepTheme = () => {
  if (localStorage.getItem('theme')) {
    if (localStorage.getItem('theme') === 'theme-dark') {
      setTheme('theme-dark');
    } else if (localStorage.getItem('theme') === 'theme-light') {
      setTheme('theme-light')
    }
  } else {
    setTheme('theme-dark')
  }
}

const changeMode = () => {
  if (localStorage.getItem('theme')) {
    if (localStorage.getItem('theme') === 'theme-dark') {
      setTheme('theme-light');
    } else if (localStorage.getItem('theme') === 'theme-light') {
      setTheme('theme-dark')
    }
  } else {
    setTheme('theme-dark')
  }
  keepTheme();
}

const getTheme = () => {
  if (localStorage.getItem('theme')) {
    return localStorage.getItem('theme')
  } else {
    setTheme('theme-dark')
    return 'theme-dark'
  }
}

module.exports = {
  setTheme,
  keepTheme,
  changeMode,
  getTheme
}