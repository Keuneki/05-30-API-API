export function searchForm() {
    const searchBy = location.pathname.split('/').filter(path => path.includes('html')).join().replace('.html', '');
    
    const formElement = document.createElement('form');
    formElement.action = './search.html';
    
    const searchInputElement = document.createElement('input');
    searchInputElement.name = 'query';
    searchInputElement.type = 'text';
    
    const submitInputElement = document.createElement('input');
    submitInputElement.value = 'Search';
    submitInputElement.type = 'submit';
    
    const searchByInputElement = document.createElement('input');
    searchByInputElement.name = 'search';
    searchByInputElement.type = 'hidden';
    searchByInputElement.value = searchBy;
    
    formElement.append(searchInputElement, searchByInputElement, submitInputElement);
  
    return formElement;
  }
  