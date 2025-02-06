let geminiWidth = 1250;

(function() {
    const sliderContainer = document.createElement('div');
    sliderContainer.classList.add('slider-container');
  
    // Add slider to body
    document.body.appendChild(sliderContainer);
  
    const sliderMarkup = `
      <input type="range" min="50" max="5000" value="5000" class="slider">
    `;
    
    sliderContainer.innerHTML = sliderMarkup;

    const slider = sliderContainer.querySelector('.slider');

    slider.addEventListener('input', (event) => {
      const currentValue = event.target.value;
      geminiWidth = currentValue;
      console.log(geminiWidth);
      changeElementsSize();
    });
    
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .slider-container {
      position: fixed;
      Bottom: 20px;
      right: 25px;C
      width: 5%;
      height: 20px;
      z-index: 100;
      }
    
      .slider {
      width: 100%;
      height: 100%;
      background: #222;
      -webkit-appearance: none;
      border-radius: 5px;
      }

      .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 15px;
      height: 15px;
      background: #333;
      border-radius: 50%;
      cursor: pointer;
      }

      .slider::-moz-range-thumb {
      width: 15px;
      height: 15px;
      background: #333;
      border-radius: 50%;
      cursor: pointer;
      }
       .sidenav-with-history-container,
    .overflow-container {
    background: #1B1C1D !important;
      }
    `;
  
    document.head.appendChild(styleElement);
  
  })();

  function changeElementsSize() {

    (function() {
      const conversationContainers = document.querySelectorAll('.conversation-container.ng-star-inserted');
      
        if (conversationContainers.length > 0) {
          conversationContainers.forEach((container) => {
            container.style.width = geminiWidth + 'px'; 
            container.style.maxWidth = '100%';
            container.style.minWidth = '30%';
          });
        }
      })();

      (function() {
        const conversationContainers = document.querySelectorAll('.input-area-container.ng-star-inserted');
      
        if (conversationContainers.length > 0) {
          conversationContainers.forEach((container) => {
            container.style.width = geminiWidth + 'px';
            container.style.maxWidth = '100%';
            container.style.minWidth = '55%';
          });
        }
      })();

      (function() {
        const conversationContainers = document.querySelectorAll('.bottom-container.ng-star-inserted');
      
        if (conversationContainers.length > 0) {
          conversationContainers.forEach((container) => {
            container.style.width = geminiWidth + 'px';
            container.style.maxWidth = '100%';
            container.style.minWidth = '55%';
          });
        }
      })();

      (function() {
        const conversationContainers = document.querySelectorAll('.text-input-field');
      
        if (conversationContainers.length > 0) {
          conversationContainers.forEach((container) => {
            container.style.height = 'auto';
            container.style.minHeight = '120px';
          });
        }
      })();
  }
  
setTimeout(changeElementsSize, 1000);

setInterval(() => changeElementsSize(), 50);

  