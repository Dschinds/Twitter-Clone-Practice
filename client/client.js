
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const API_URL = 'http://localhost:5000/mews';

loadingElement.style.display = ''; 

listAllMews();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');
  const mew = {
      name,
      content
  }
  form.style.display = 'none';
  loadingElement.style.display = ''; 
  fetch(API_URL, {
    method: 'Post',
    body: JSON.stringify(mew),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(createdMew =>{
    console.log(createdMew);
    form.reset();
    setTimeout(() => {
    form.style.display = '';
    }, 30000);
    
  loadingElement.style.display = 'none';
  listAllMews(); 
  });
  
})

function listAllMews(){
  mewsElement.innerHTML = '';
  fetch(API_URL)
    .then(response => response.json())
    .then(mew => {
      console.log(mew);
      mew.reverse();
      mew.forEach(post => {
        const div = document.createElement('div');

        const header = document.createElement('h2');
        header.textContent = post.name;

        const contents = document.createElement('p');
        contents.textContent = post.content;

        const date = document.createElement('small');
        date.textContent = new Date(post.created);
        
        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        mewsElement.appendChild(div);

        loadingElement.style.display = 'none'; 

      })
    })
}