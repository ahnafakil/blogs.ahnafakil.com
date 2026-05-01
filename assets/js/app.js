(function(){'use strict';
var toggle=document.querySelector('.nav-toggle'),links=document.querySelector('.nav-links');
if(toggle&&links){toggle.addEventListener('click',function(){links.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(links.classList.contains('is-open')))});links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('is-open')})})}
var reveals=document.querySelectorAll('.reveal, .reveal-stagger');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});reveals.forEach(function(el){io.observe(el)})}else{reveals.forEach(function(el){el.classList.add('is-visible')})}
var path=window.location.pathname.replace(/\/$/,'')||'/';
document.querySelectorAll('.nav-links a').forEach(function(a){var href=a.getAttribute('href');if(!href||href.startsWith('http'))return;var clean=href.replace(/\/$/,'')||'/';if(clean===path||(clean!=='/'&&path.startsWith(clean)))a.classList.add('active')});
document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
})();
