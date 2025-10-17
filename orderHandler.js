// orderHandler.js

// Выбранные
let selectedDishes = {
  soup: null,
  main: null,
  drink: null
};

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.dish-card')) {
        // Вверх по дереву до ближайшего родителя
      const card = e.target.closest('.dish-card');
      const keyword = card.getAttribute('data-dish');
      
      // Находим блюдо в массиве
      const dish = dishes.find(d => d.keyword === keyword);
      if (!dish) return;


      const category = dish.category;

      selectedDishes[category] = dish;
      updateOrderForm();
    }
  });
  
  // Чтобы при старте выводилось "ничего не выбрано"
  updateOrderForm();
});

function updateOrderForm() {
  const orderSummary = document.querySelector('.order-summary');
  const totalDisplay = document.getElementById('total-price');

  const hasSoup = selectedDishes.soup !== null;
  const hasMain = selectedDishes.main !== null;
  const hasDrink = selectedDishes.drink !== null;
  const hasSelected = hasSoup || hasMain || hasDrink;

  if (!hasSelected) {
    // Показываем "Ничего не выбрано"
    orderSummary.innerHTML = '<div id="nothing-selected">Ничего не выбрано</div>';
    if (totalDisplay) totalDisplay.style.display = 'none';
    return;
  }

  // Иначе — отображаем детали заказа
  let totalPrice = 0;

  const lines = [];

  if (hasSoup) {
    lines.push(`<div class="form-group"><label>Суп:</label> ${selectedDishes.soup.name} — ${selectedDishes.soup.price}₽</div>`);
    totalPrice += selectedDishes.soup.price;
  } else {
    lines.push('<div class="form-group"><label>Суп:</label> Блюдо не выбрано</div>');
  }

  if (hasMain) {
    lines.push(`<div class="form-group"><label>Главное блюдо:</label> ${selectedDishes.main.name} — ${selectedDishes.main.price}₽</div>`);
    totalPrice += selectedDishes.main.price;
  } else {
    lines.push('<div class="form-group"><label>Главное блюдо:</label> Блюдо не выбрано</div>');
  }

  if (hasDrink) {
    lines.push(`<div class="form-group"><label>Напиток:</label> ${selectedDishes.drink.name} — ${selectedDishes.drink.price}₽</div>`);
    totalPrice += selectedDishes.drink.price;
  } else {
    lines.push('<div class="form-group"><label>Напиток:</label> Напиток не выбран</div>');
  }

  lines.push(`<div class="form-group"><label>Стоимость заказа:</label> ${totalPrice}₽</div>`);

  orderSummary.innerHTML = lines.join('');
}