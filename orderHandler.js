// Выбранные блюда — теперь 5 категорий
let selectedDishes = {
  soup: null,
  main: null,
  drink: null,
  starter: null,
  dessert: null
};

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.dish-card')) {
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
  
  // Инициализация: показать "Ничего не выбрано" при загрузке
  updateOrderForm();
});

function updateOrderForm() {
  const orderSummary = document.querySelector('.order-summary');

  const hasSoup = selectedDishes.soup !== null;
  const hasMain = selectedDishes.main !== null;
  const hasDrink = selectedDishes.drink !== null;
  const hasStarter = selectedDishes.starter !== null;
  const hasDessert = selectedDishes.dessert !== null;

  const hasSelected = hasSoup || hasMain || hasDrink || hasStarter || hasDessert;

  if (!hasSelected) {
    orderSummary.innerHTML = '<div id="nothing-selected">Ничего не выбрано</div>';
    return;
  }

  let totalPrice = 0;
  const lines = [];

  // Суп
  if (hasSoup) {
    lines.push(`<div class="form-group"><label>Суп:</label> ${selectedDishes.soup.name} — ${selectedDishes.soup.price}₽</div>`);
    totalPrice += selectedDishes.soup.price;
  } else {
    lines.push('<div class="form-group"><label>Суп:</label> Блюдо не выбрано</div>');
  }

  // Главное блюдо
  if (hasMain) {
    lines.push(`<div class="form-group"><label>Главное блюдо:</label> ${selectedDishes.main.name} — ${selectedDishes.main.price}₽</div>`);
    totalPrice += selectedDishes.main.price;
  } else {
    lines.push('<div class="form-group"><label>Главное блюдо:</label> Блюдо не выбрано</div>');
  }

  // Салат/стартер
  if (hasStarter) {
    lines.push(`<div class="form-group"><label>Салат или стартер:</label> ${selectedDishes.starter.name} — ${selectedDishes.starter.price}₽</div>`);
    totalPrice += selectedDishes.starter.price;
  } else {
    lines.push('<div class="form-group"><label>Салат или стартер:</label> Блюдо не выбрано</div>');
  }

  // Напиток
  if (hasDrink) {
    lines.push(`<div class="form-group"><label>Напиток:</label> ${selectedDishes.drink.name} — ${selectedDishes.drink.price}₽</div>`);
    totalPrice += selectedDishes.drink.price;
  } else {
    lines.push('<div class="form-group"><label>Напиток:</label> Напиток не выбран</div>');
  }

  // Десерт
  if (hasDessert) {
    lines.push(`<div class="form-group"><label>Десерт:</label> ${selectedDishes.dessert.name} — ${selectedDishes.dessert.price}₽</div>`);
    totalPrice += selectedDishes.dessert.price;
  } else {
    lines.push('<div class="form-group"><label>Десерт:</label> Десерт не выбран</div>');
  }

  // Итоговая стоимость
  lines.push(`<div class="form-group total-cost"><label>Стоимость заказа:</label> ${totalPrice}₽</div>`);

  orderSummary.innerHTML = lines.join('');
}