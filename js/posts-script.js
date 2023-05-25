import { getServerData } from './fetch-module.js';
import { mainNavMenu } from './nav-module.js';
import { doStrFirstCapitalize } from './function-module.js';

async function getPostsWithCommentsAndUser() {
  const userId = new URLSearchParams(location.search).get('user_id');
  let dataForm = 'posts?_expand=user&_embed=comments';
  if (userId) {
    dataForm = `posts?_expand=user&_embed=comments&userId=${userId}`;
  }
  const posts = await getServerData(dataForm);
  renderView(posts);
}

function renderView(posts) {
  const containerElement = document.querySelector('.container');
  const ulElement = document.createElement('ul');
  ulElement.classList.add('post-list');
  containerElement.appendChild(ulElement);

  posts.forEach(post => {
    const liElement = document.createElement('li');
    const postLinkElement = document.createElement('a');
    const authorLinkElement = document.createElement('a');

    postLinkElement.textContent = `${doStrFirstCapitalize(post.title)} (${post.comments.length})`;
    postLinkElement.href = `./post.html?post_id=${post.id}`;

    authorLinkElement.textContent = post.user.name;
    authorLinkElement.href = `./user.html?user_id=${post.user.id}`;

    liElement.append(postLinkElement, ' ', authorLinkElement);
    ulElement.appendChild(liElement);
  });
}

getPostsWithCommentsAndUser();
mainNavMenu();
