import { getServerData } from "./fetch-module.js";
import { doStrFirstCapitalize } from './function-module.js';

async function getPost() {
  const postId = new URLSearchParams(location.search).get('post_id');
  const dataForm = `posts/${postId}/?_expand=user&_embed=comments`;
  const post = await getServerData(dataForm);
  renderView(post);
}

function renderView(post) {
  const containerElement = document.querySelector('.container');

  const postContentElement = document.createElement('div');
  postContentElement.classList.add('post-content');
  containerElement.appendChild(postContentElement);

  const commentsElement = document.createElement('div');
  commentsElement.classList.add('comments-list');
  containerElement.appendChild(commentsElement);

  const postTitleElement = document.createElement('h1');
  postTitleElement.textContent = doStrFirstCapitalize(post.title);
  postContentElement.appendChild(postTitleElement);

  const postUserElement = document.createElement('h2');
  const postUserLinkElement = document.createElement('a');
  postUserLinkElement.classList.add('style');
  postUserLinkElement.href = `./user.html?user_id=${post.user.id}`;
  postUserLinkElement.textContent = post.user.name;
  postUserElement.appendChild(postUserLinkElement);
  postContentElement.appendChild(postUserElement);

  const postBodyElement = document.createElement('p');
  postBodyElement.textContent = doStrFirstCapitalize(post.body);
  postContentElement.appendChild(postBodyElement);

  post.comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');

    const commentNameElement = document.createElement('h3');
    commentNameElement.textContent = doStrFirstCapitalize(comment.name);
    commentElement.appendChild(commentNameElement);

    const commentBodyElement = document.createElement('p');
    commentBodyElement.textContent = doStrFirstCapitalize(comment.body);
    commentElement.appendChild(commentBodyElement);

    const commentEmailElement = document.createElement('a');
    commentEmailElement.classList.add('style');
    commentEmailElement.href = `mailto:${comment.email}`;
    commentEmailElement.textContent = comment.email;
    commentElement.appendChild(commentEmailElement);

    commentsElement.appendChild(commentElement);
  });

  const linkUserPostsElement = document.createElement('a');
  linkUserPostsElement.classList.add('style', 'top-margin');
  linkUserPostsElement.textContent = `${post.user.name} all posts`;
  linkUserPostsElement.href = `./posts.html?user_id=${post.user.id}`;
  containerElement.appendChild(linkUserPostsElement);
}

getPost();
