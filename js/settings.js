const btnThemeSwitch = document.getElementById('btnThemeSwitch');
const btnThemeInlineSwitch = document.getElementById('btnThemeInlineSwitch');
const iconThemeSwitch = document.getElementById('themeIcon');
const iconThemeInlineSwitch = document.getElementById('themeInlineIcon');

btnThemeSwitch.addEventListener('click',()=>{
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light');
        iconThemeSwitch.className = 'bi bi-brightness-high-fill';
        iconThemeInlineSwitch.className = 'bi bi-brightness-high-fill';
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark');
        iconThemeSwitch.className = 'bi bi-moon-stars-fill';
        iconThemeInlineSwitch.className = 'bi bi-moon-stars-fill';
    }
})

btnThemeInlineSwitch.addEventListener('click',()=>{
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light');
        iconThemeSwitch.className = 'bi bi-brightness-high-fill';
        iconThemeInlineSwitch.className = 'bi bi-moon-stars-fill';
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark');
        iconThemeSwitch.className = 'bi bi-moon-stars-fill';
        iconThemeInlineSwitch.className = 'bi bi-moon-stars-fill';
    }
})