import { getServerData } from './fetch-module.js';
import { doStrFirstCapitalize, doStrFirstLowerCase } from './function-module.js';

async function getUser() {
  const userId = new URLSearchParams(location.search).get('user_id');
  const dataForm = `users/${userId}/?_embed=posts&_embed=albums`;
  const user = await getServerData(dataForm);
  renderUser(user);
}

function renderUser(user) {
  const containerElement = document.querySelector('.container');

  // Create user information section
  const userSection = document.createElement('section');
  userSection.classList.add('user-info');

  const userNameElement = document.createElement('h2');
  userNameElement.textContent = user.name;

  const userInfoList = document.createElement('ul');
  userInfoList.classList.add('user-info-list');

  const nickNameLiElement = createListItem('Nickname', user.username);
  const emailLiElement = createListItem('Email', user.email, 'mailto:');
  const phoneLiElement = createListItem('Phone', user.phone, 'tel:');
  const websiteLiElement = createListItem('Website', user.website, 'http://', '_blank');

  userInfoList.append(nickNameLiElement, emailLiElement, phoneLiElement, websiteLiElement);
  userSection.append(userNameElement, userInfoList);

  // Create address section
  const addressSection = document.createElement('section');
  addressSection.classList.add('address');

  const addressTitleElement = document.createElement('h3');
  addressTitleElement.textContent = 'Address';

  const addressList = document.createElement('ul');
  addressList.classList.add('address-list');

  const { city, geo, street, suite, zipcode } = user.address;
  const addressItems = [
    { label: 'Suite', value: suite },
    { label: 'Street', value: street },
    { label: 'Zip Code', value: zipcode },
    { label: 'City', value: city }
  ];

  addressItems.forEach(item => {
    const liElement = createListItem(item.label, item.value);
    addressList.appendChild(liElement);
  });

  addressSection.append(addressTitleElement, addressList);


  const companySection = document.createElement('section');
  companySection.classList.add('company');

  const companyTitleElement = document.createElement('h3');
  companyTitleElement.textContent = 'Company';

  const companyNameElement = document.createElement('p');
  companyNameElement.textContent = user.company.name;

  const businessStyleTitleElement = document.createElement('h4');
  businessStyleTitleElement.textContent = 'Business Style';

  const businessStyleList = document.createElement('ul');
  businessStyleList.classList.add('business-style-list');

  const bs = user.company.bs.split(' ');
  bs.forEach(bstype => {
    const liElement = createListItem(null, doStrFirstLowerCase(bstype));
    businessStyleList.appendChild(liElement);
  });

  const catchPhraseTitleElement = document.createElement('h4');
  catchPhraseTitleElement.textContent = 'Catch Phrase';

  const catchPhraseList = document.createElement('ul');
  catchPhraseList.classList.add('catch-phrase-list');

  const catchPhrase = user.company.catchPhrase.split(' ');
  catchPhrase.forEach(phrase => {
    const liElement = createListItem(null, doStrFirstLowerCase(phrase));
    catchPhraseList.appendChild(liElement);
  });

  companySection.append(
    companyTitleElement,
    companyNameElement,
    businessStyleTitleElement,
    businessStyleList,
    catchPhraseTitleElement,
    catchPhraseList
  );

  // Create posts section
  const postsSection = document.createElement('section');
  postsSection.classList.add('posts');

  const postsTitleElement = document.createElement('h3');
  postsTitleElement.textContent = 'Posts';

  const postsList = document.createElement('ul');
  postsList.classList.add('posts-list');

  user.posts.forEach(post => {
    const liElement = createListItem(null, doStrFirstCapitalize(post.title));
    const postLinkElement = document.createElement('a');
    postLinkElement.href = `./post.html?post_id=${post.id}`;
    postLinkElement.appendChild(liElement);
    postsList.appendChild(postLinkElement);
  });

  postsSection.append(postsTitleElement, postsList);

  // Create albums section
  const albumsSection = document.createElement('section');
  albumsSection.classList.add('albums');

  const albumsTitleElement = document.createElement('h3');
  albumsTitleElement.textContent = 'Albums';

  const albumsList = document.createElement('ul');
  albumsList.classList.add('albums-list');

  user.albums.forEach(album => {
    const liElement = createListItem(null, doStrFirstCapitalize(album.title));
    const albumLinkElement = document.createElement('a');
    albumLinkElement.href = `./album.html?album_id=${album.id}`;
    albumLinkElement.appendChild(liElement);
    albumsList.appendChild(albumLinkElement);
  });

  albumsSection.append(albumsTitleElement, albumsList);

  // Append sections to container
  containerElement.append(
    userSection,
    addressSection,
    companySection,
    postsSection,
    albumsSection
  );
}

function createListItem(label, value, href = null, target = null) {
  const liElement = document.createElement('li');

  if (label) {
    const labelElement = document.createElement('span');
    labelElement.classList.add('label');
    labelElement.textContent = label + ': ';
    liElement.appendChild(labelElement);
  }

  const valueElement = document.createElement('span');
  valueElement.classList.add('value');

  if (href) {
    const linkElement = document.createElement('a');
    linkElement.href = href + value;
    linkElement.target = target;
    linkElement.textContent = value;
    valueElement.appendChild(linkElement);
  } else {
    valueElement.textContent = value;
  }

  liElement.appendChild(valueElement);

  return liElement;
}

getUser();
