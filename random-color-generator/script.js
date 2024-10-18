const body = document.body;
const inputForm = document.querySelector('.form')

const copyBtn = document.querySelector('.copyBtn');

const inputBox = document.getElementById('parag');


function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        inputBox.value=color;
        body.style.backgroundColor=color.toString();
    }

copyBtn.onclick= (e) => {
    e.preventDefault();
    if(inputBox.value != ""){
      inputBox.select();
      inputBox.setSelectionRange(0, 99999);

      navigator.clipboard.writeText(inputBox.value);
      alert("Copied "+ inputBox.value + " to clipboard" )
    }else {
        alert("Nothing to copy to clipboard")
    }
      
}