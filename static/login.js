const loginForm = document.querySelector('#login-form');
const modal = document.querySelector('.modal-content');
const message = document.querySelector('#message2');
document.addEventListener("DOMContentLoaded"    , () => {
   const param = new URLSearchParams(document.location.search);
   const attempt = param.get('attempt');
   if (attempt === 'unsuccessful') {
       loginForm.classList.add('inactive');
       message.classList.remove('inactive')
       modal.addEventListener('click', () => {
           message.classList.add('inactive')
           loginForm.classList.remove('inactive');
       })
   }
})