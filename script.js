class App {
   constructor(items, slides, app) {
      this.items = items;
      this.slides = slides;
      this.category = new Category(this.items);
      this.slider = new Slider(this.slides, this.items);
      this.app = app;
   }

   makeCategory(category) {
      
      this.category.changeCategory(category);
      this.slider = new Slider(this.slides, Array.from(document.querySelectorAll('.slide')));
      this.slider.makeSlider();
   }

   changePage(slide) {
      
      let pizza = slide.querySelector('.pizza-pic');
      let coords = pizza.getBoundingClientRect();

      let price = slide.querySelector('.pizza-price'),
          name = slide.querySelector('.pizza-name'),
          button = document.createElement('button');

      


      Array.from(this.app.children).forEach(elem => {
            elem.classList.add('dissapear');
      });
      this.app.style.backgroundColor = '#fff';
      setTimeout(() => {
         Array.from(this.app.children).forEach(elem => {
               elem.style.display = 'none';
         });
         
         // pizza.style.right = '-10px';
         // pizza.style.top = '-10px';
         // pizza.style.transform = 'scale(2)';
         pizzaRotation(pizza, coords.left, coords.top);
         this.app.append(pizza);

         callContent(price, name, button);
         this.app.append(price);
         this.app.append(name);
         this.app.append(button);

      }, 800);
      

      
   }

}
function callContent(price, name, button) {
   price.classList.add('appear');
   price.style.position = 'absolute';
   price.style.left = 530 + 'px';
   price.style.top = 340 + 'px';
   price.style.fontSize = 32 + 'px';
   price.style.color = '#23272E';

   name.style.position = 'absolute';
   name.style.left = 530 + 'px';
   name.style.top = 420 + 'px';
   name.style.fontSize = 32 + 'px';
   name.style.color = '#23272E';
   name.style.width = 275 + 'px';
   name.classList.add('appear');

   button.style.position = 'absolute';
   button.style.left = 530 + 'px';
   button.style.top = 690 + 'px';
   button.style.width = 357 + 'px';
   button.style.height = 73 + 'px';
   button.innerHTML = 'Make order';
   button.style.fontFamily = 'Inter';
   button.style.fontSize = 24 + 'px';
   button.style.border = 'none';
   button.style.borderRadius = 16 + 'px';
   button.style.backgroundColor = 'rgba(159, 158, 157, 0.11)';
   button.classList.add('appear');
}
function pizzaRotation(pizza, left, top) {

   pizza.style.position = 'absolute';
   pizza.style.left = left + 'px';
   pizza.style.top = top + 'px';

   let height = 310,
       width = 130,
       rotate = 180;

   let quadEasyOut = makeEaseOut(quad);
   let easeOut = makeEaseOut(linear);

   animate({
      duration: 800,
      timing: easeOut,
      draw: function(progress) {
         pizza.style.top = top + -progress * height + 'px';
      }
   });
  
   animate({
      duration: 800,
      timing: quadEasyOut,
      draw: function(progress) {
         pizza.style.left = left + progress * width + 'px';
      }
   });
    
   animate({
      duration: 800,
      timing: quadEasyOut,
      draw: function(progress) {
         pizza.style.transform = `rotate(` + progress*rotate + `deg) scale(${progress * 2.5})`;
      }
   });

}
function quad(progress) {
   return Math.pow(progress, 2)
}

function linear(timeFraction) {
   return timeFraction;
}
 
 // преобразователь в easeOut
function makeEaseOut(timing) {
   return function(timeFraction) {
     return 1 - timing(1 - timeFraction);
   }
}

function animate(options) {

   var start = performance.now();
 
   requestAnimationFrame(function animate(time) {
     // timeFraction от 0 до 1
     var timeFraction = (time - start) / options.duration;
     if (timeFraction > 1) timeFraction = 1;
 
     // текущее состояние анимации
     var progress = options.timing(timeFraction)
     
     options.draw(progress);
 
     if (timeFraction < 1) {
       requestAnimationFrame(animate);
     }
 
   });
}

class Slider {
   constructor(slides, items) {
      this.slides = slides;
      this.items = items;
      this.margin = 0;
      this.offset = 0;
      this.itemIndex = 0;
      this.slidesWidth = 0;
   }

   makeSlider() {
      let slide = this.items[0],
          slideOffsetWidth = 195,
          slideMargin = Number(getComputedStyle(slide).marginLeft.match(/\d+/)[0]);

      this.slidesWidth = slideOffsetWidth * this.items.length + slideMargin * 2 * (this.items.length - 1);
      this.slides.style.width = this.slidesWidth + 'px';
      this.slides.style.left = 0;
      this.margin = slideMargin;
   }

   next() {
      
      let activeSlide = document.querySelector('.active-slide');
      this.offset += activeSlide.offsetWidth + this.margin * 2;

      if (this.offset > this.slidesWidth - 30) {
         this.offset -= activeSlide.offsetWidth + this.margin * 2;
         return;
      }

      this.slides.style.left = -this.offset + 'px';
      activeSlide.classList.remove('active-slide');
      this.items[++this.itemIndex].classList.add('active-slide');
   }

   previous() {
      let activeSlide = document.querySelector('.active-slide');
      this.offset -= activeSlide.offsetWidth + this.margin * 2;

      if (this.offset < 0) {
         this.offset += activeSlide.offsetWidth + this.margin * 2;
         return;
      }

      this.slides.style.left = -this.offset + 'px';
      activeSlide.classList.remove('active-slide');
      this.items[--this.itemIndex].classList.add('active-slide');
   }
}


class Category {
   constructor(items) {
      this.items = items;
   }

   changeCategory(category) {
      let categoryName = category.classList[1];
      let activeCategory = document.querySelector('.active-category');

      activeCategory.classList.remove('active-category');
      category.classList.add('active-category');

      if (categoryName == 'all') {
         this.items.forEach(item => {
             if (getComputedStyle(item).display == 'none') item.style.display = 'flex';
         });
      } else {
         this.items.forEach(item => {
            if (!item.classList.contains(categoryName)) {
               item.style.display = 'none';
            } else {
               item.style.display = 'flex';
            }
         });
      }
   }
}

let app = new App(Array.from(document.querySelectorAll('.slide')), document.querySelector('.slides'), document.querySelector('.app'));


document.querySelectorAll('.categories-item').forEach(item => {
   item.addEventListener('click', function() {
      app.makeCategory.call(app, item);
   });
});
app.slider.makeSlider();
document.querySelector('.prev').addEventListener('click', function() {
   app.slider.previous.call(app.slider);
});
document.querySelector('.next').addEventListener('click', function() {
   app.slider.next.call(app.slider);
});

document.querySelectorAll('.slide').forEach(item => {
   item.addEventListener('click', function() {
      app.changePage.call(app, item);
   });
})




