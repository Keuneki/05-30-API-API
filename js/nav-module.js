import { searchForm } from "./search-module.js";

async function mainNavMenu() {
  const res = await fetch('./js/menu.json');
  const menuData = await res.json();
  const navElement = document.querySelector('#menu');
  const menuElement = document.createElement('ul');
  menuElement.classList.add('menu-list');
  const formElement = searchForm();
  navElement.appendChild(menuElement);

  const pathName = location.pathname.split('/').filter(path => path.includes('html')).join();

  for (const page in menuData) {
    const url = menuData[page];
    const pageElement = createPageElement(page, url, pathName);
    menuElement.appendChild(pageElement);
  }

  addActiveClass(menuElement, pathName);

  if (pathName !== 'index.html' && pathName) {
    navElement.appendChild(formElement);
  }
}

function createPageElement(page, url, pathName) {
  const pageElement = document.createElement('li');
  const linkElement = document.createElement('a');
  linkElement.textContent = page;
  linkElement.href = url;
  pageElement.appendChild(linkElement);
  return pageElement;
}

function addActiveClass(menuElement, pathName) {
  const linkElements = menuElement.querySelectorAll('a');
  linkElements.forEach(linkElement => {
    const linkUrl = linkElement.href.split('/').pop();
    if ((linkUrl === pathName && pathName !== '') || (linkUrl === 'index.html' && pathName === '')) {
      linkElement.classList.add('active');
    }
  });
}

export { mainNavMenu };
