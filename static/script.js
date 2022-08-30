window.addEventListener('resize', function(event){
    if (window.innerWidth < 990) {
        document.querySelector('#small-window-list').classList.remove('inactive');
        document.querySelector('#my-table').classList.add('inactive')
    } else {
        document.querySelector('#small-window-list').classList.add('inactive');
        document.querySelector('#my-table').classList.remove('inactive')
    }
});