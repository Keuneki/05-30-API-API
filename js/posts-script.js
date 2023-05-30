import { getServerData } from './fetch-module.js';
import { mainNavMenu } from './nav-module.js';
import { doStrFirstCapitalize } from './function-module.js';

const containerElement = document.createElement('div');
containerElement.classList.add('container');
document.body.appendChild(containerElement);

const pageLimitSelect = createPageLimitSelect();
const pageLinksElement = document.createElement('div');
pageLinksElement.classList.add('page-links');

let currentPage = 1;
let totalPosts = 0;
let totalPages = 0;
let pageLimit = 25;

pageLimitSelect.addEventListener('change', () => {
  pageLimit = parseInt(pageLimitSelect.value);
  currentPage = 1;
  containerElement.innerHTML = '';
  getPostsWithCommentsAndUser();
});

async function getPostsWithCommentsAndUser() {
  const userId = new URLSearchParams(location.search).get('user_id');
  let dataForm = 'posts?_expand=user&_embed=comments';
  if (userId) {
    dataForm = `posts?_expand=user&_embed=comments&userId=${userId}`;
  }
  const posts = await getServerData(dataForm);
  totalPosts = posts.length;
  totalPages = Math.ceil(totalPosts / pageLimit);

  renderView(posts);
  renderPageLinks();
}

function renderView(posts) {
  const ulElement = document.createElement('ul');
  ulElement.classList.add('post-list');
  containerElement.appendChild(ulElement);

  const startIndex = (currentPage - 1) * pageLimit;
  const endIndex = currentPage * pageLimit;

  for (let i = startIndex; i < endIndex && i < totalPosts; i++) {
    const post = posts[i];
    const liElement = document.createElement('li');
    const postLinkElement = document.createElement('a');
    const authorLinkElement = document.createElement('a');

    postLinkElement.textContent = `${doStrFirstCapitalize(post.title)} (${post.comments.length})`;
    postLinkElement.href = `./post.html?post_id=${post.id}`;

    authorLinkElement.textContent = post.user.name;
    authorLinkElement.href = `./user.html?user_id=${post.user.id}`;

    liElement.append(postLinkElement, ' ', authorLinkElement);
    ulElement.appendChild(liElement);
  }
}

function renderPageLinks() {
  pageLinksElement.innerHTML = '';

  const previousPageLink = createPageLink('Previous', currentPage > 1, () => {
    if (currentPage > 1) {
      currentPage--;
      containerElement.innerHTML = '';
      getPostsWithCommentsAndUser();
    }
  });
  pageLinksElement.appendChild(previousPageLink);

  for (let page = 1; page <= totalPages; page++) {
    const pageLinkElement = createPageLink(page.toString(), page !== currentPage, () => {
      currentPage = page;
      containerElement.innerHTML = '';
      getPostsWithCommentsAndUser();
    });
    pageLinksElement.appendChild(pageLinkElement);
  }

  const nextPageLink = createPageLink('Next', currentPage < totalPages, () => {
    if (currentPage < totalPages) {
      currentPage++;
      containerElement.innerHTML = '';
      getPostsWithCommentsAndUser();
    }
  });
  pageLinksElement.appendChild(nextPageLink);

  containerElement.appendChild(pageLinksElement);
}

function createPageLimitSelect() {
  const selectElement = document.createElement('select');
  selectElement.id = 'page-limit';

  for (let i = 10; i <= 100; i += 10) {
    const option = document.createElement('option');
    option.value = i.toString();
    option.textContent = i.toString();
    selectElement.appendChild(option);
  }

  const pageLimitLabel = document.createElement('label');
  pageLimitLabel.textContent = 'Posts per page:';
  pageLimitLabel.appendChild(selectElement);

  const pageLimitWrapper = document.createElement('div');
  pageLimitWrapper.classList.add('page-limit-wrapper');
  pageLimitWrapper.appendChild(pageLimitLabel);

  document.body.insertBefore(pageLimitWrapper, containerElement);
  return selectElement;
}

function createPageLink(text, isEnabled, clickHandler) {
  const linkElement = document.createElement('button');
  linkElement.textContent = text;
  linkElement.disabled = !isEnabled;
  linkElement.addEventListener('click', clickHandler);
  return linkElement;
}

getPostsWithCommentsAndUser();
mainNavMenu();
