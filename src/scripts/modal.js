
import '../styles/modal.scss';

const modal = document.getElementById("myModal");
const btn = document.getElementById("button");
const span = document.getElementsByClassName("close")[0];
const infoModal = document.getElementById('infoModal');
const infoBtn = document.getElementById("info-button");

btn.onclick = function() {
  modal.style.display = "block";
};


span.onclick = function() {
  modal.style.display = "none";
  infoModal.style.display= 'none';
};


window.onclick = function(event) {
  if (event.target == modal || event.target == infoModal) {
    modal.style.display = "none";
    infoModal.style.display = 'none';
  }
};

infoBtn.onclick= function(){
  infoModal.style.display = 'block';
};

