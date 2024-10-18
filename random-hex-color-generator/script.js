var bgText = document.querySelector('.clickMe');

function copy(e) {
    // find target element
    var
      t = e.target,
      c = t.dataset.copytarget,
      inp = (c ? document.querySelector(c) : null);
    // is element selectable?
    if (inp && inp.select) {

      // select text
      inp.select();

      try {
        // copy text
        document.execCommand('copy');
        runCopiedMsg();
        inp.blur();
      } catch (err) {
        alert('please press Ctrl/Cmd+C to copy');
      }
    }
  }

  function randomizeHex(iterations) {
    var colorsArr = [];
    for (i = 0; i < iterations; i++) {
      colorsArr.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    return colorsArr;
  };

  function createElement(hexString) {
    var elem = document.createElement('div');
    var childElem = document.createElement('input');
    var paletteWrapper = document.querySelector('.wrapper_palette');
    var copyBtn = document.createElement('button');
    var brushIcon = document.createElement('i');
    brushIcon.setAttribute("class", "fa fa-paint-brush");

    copyBtn.setAttribute("class", "btn_copy");
    copyBtn.setAttribute("title", "Copy to clipoard");
    brushIcon.setAttribute("data-copytarget", "#a" + hexString.substr(1));
    copyBtn.setAttribute("data-copytarget", "#a" + hexString.substr(1));
    copyBtn.appendChild(brushIcon);
    copyBtn.addEventListener('click', copy);

    childElem.setAttribute("type", "text");
    childElem.setAttribute("value", hexString);
    childElem.readOnly = true;
    childElem.setAttribute("id", "a" + hexString.substr(1));

    elem.setAttribute("class", "colorCircle");
    elem.style.background = hexString;
    elem.appendChild(childElem);
    elem.appendChild(copyBtn);

    paletteWrapper.appendChild(elem);
  };

  function go() {
    var colors = randomizeHex(6);
    var time = 4;
    
   
    if(bgText.style.display !== 'none') {
      bgText.style.display = 'none';
      console.log(bgText);
    }
    
    colors.forEach(function(index) {
      setTimeout(function() {
        return createElement(index)
      }, time);
      time += 100;
    });
  }

function runCopiedMsg(){
  console.log('copied');
  var okElement = document.createElement('span');
  var peaceIcon = document.createElement('i');
  
  peaceIcon.setAttribute("class", "fa fa-hand-peace-o");
  okElement.setAttribute("class", "ok-msg");
    okElement.innerHTML= "Copied To Clipboard ";
  okElement.appendChild(peaceIcon);

  console.log(okElement)
  document.body.appendChild(okElement);
   setTimeout(function() {
        return okElement.style.display = "none";
      }, 3000);
}