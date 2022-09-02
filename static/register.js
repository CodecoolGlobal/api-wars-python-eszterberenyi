const registrationForm = document.querySelector('#registration-form');
const modal = document.querySelector('.modal-content');
const message = document.querySelector('#message');
document.addEventListener("DOMContentLoaded"    , () => {
   const param = new URLSearchParams(document.location.search);
   const attempt = param.get('attempt');
   if (attempt === 'unsuccessful') {
       registrationForm.classList.add('inactive');
       message.classList.remove('inactive')
       modal.addEventListener('click', () => {
           message.classList.add('inactive')
           registrationForm.classList.remove('inactive');
       })
   }
})