// Глобальный объект выбранных блюд
let selectedDishes = {
  soup: null,
  'main-course': null,
  drink: null,
  salad: null,
  dessert: null
};

// Ключ для localStorage
const ORDER_STORAGE_KEY = 'foodConstructOrder';

// Загрузка заказа из localStorage при старте
function loadOrderFromStorage() {
  const saved = localStorage.getItem(ORDER_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Восстанавливаем только допустимые ключи
      selectedDishes = {
        soup: parsed.soup || null,
        'main-course': parsed['main-course'] || null,
        drink: parsed.drink || null,
        salad: parsed.salad || null,
        dessert: parsed.dessert || null
      };
    } catch (e) {
      console.warn('Ошибка при загрузке заказа из localStorage', e);
    }
  }
}

// Сохранение заказа в localStorage
function saveOrderToStorage() {
  const toSave = {
    soup: selectedDishes.soup?.keyword || null,
    'main-course': selectedDishes['main-course']?.keyword || null,
    drink: selectedDishes.drink?.keyword || null,
    salad: selectedDishes.salad?.keyword || null,
    dessert: selectedDishes.dessert?.keyword || null
  };
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(toSave));
}

document.addEventListener('DOMContentLoaded', function () {
  // Загружаем сохранённый заказ
  loadOrderFromStorage();

  document.addEventListener('click', function (e) {
    if (e.target.closest('.dish-card')) {
      const card = e.target.closest('.dish-card');
      const keyword = card.getAttribute('data-dish');

      const dish = window.dishesData.find(d => d.keyword === keyword);
      if (!dish) return;

      const category = dish.category;
      selectedDishes[category] = dish;
      saveOrderToStorage(); // ← Сохраняем сразу после выбора
      updateOrderForm();
    }
  });

  updateOrderForm();
});

// Остальное без изменений...
function updateOrderForm() {
  const orderSummary = document.querySelector('.order-summary');

  const hasSoup = selectedDishes.soup !== null;
  const hasMain = selectedDishes['main-course'] !== null;
  const hasDrink = selectedDishes.drink !== null;
  const hasStarter = selectedDishes.salad !== null;
  const hasDessert = selectedDishes.dessert !== null;

  const hasSelected = hasSoup || hasMain || hasDrink || hasStarter || hasDessert;

  if (!hasSelected) {
    orderSummary.innerHTML = '<div id="nothing-selected">Ничего не выбрано</div>';
    return;
  }

  let totalPrice = 0;
  const lines = [];

  if (hasSoup) {
    lines.push(`<div class="form-group"><label>Суп:</label> ${selectedDishes.soup.name} — ${selectedDishes.soup.price}₽</div>`);
    totalPrice += selectedDishes.soup.price;
  } else {
    lines.push('<div class="form-group"><label>Суп:</label> Блюдо не выбрано</div>');
  }

  if (hasMain) {
    lines.push(`<div class="form-group"><label>Главное блюдо:</label> ${selectedDishes['main-course'].name} — ${selectedDishes['main-course'].price}₽</div>`);
    totalPrice += selectedDishes['main-course'].price;
  } else {
    lines.push('<div class="form-group"><label>Главное блюдо:</label> Блюдо не выбрано</div>');
  }

  if (hasStarter) {
    lines.push(`<div class="form-group"><label>Салат или стартер:</label> ${selectedDishes.salad.name} — ${selectedDishes.salad.price}₽</div>`);
    totalPrice += selectedDishes.salad.price;
  } else {
    lines.push('<div class="form-group"><label>Салат или стартер:</label> Блюдо не выбрано</div>');
  }

  if (hasDrink) {
    lines.push(`<div class="form-group"><label>Напиток:</label> ${selectedDishes.drink.name} — ${selectedDishes.drink.price}₽</div>`);
    totalPrice += selectedDishes.drink.price;
  } else {
    lines.push('<div class="form-group"><label>Напиток:</label> Напиток не выбран</div>');
  }

  if (hasDessert) {
    lines.push(`<div class="form-group"><label>Десерт:</label> ${selectedDishes.dessert.name} — ${selectedDishes.dessert.price}₽</div>`);
    totalPrice += selectedDishes.dessert.price;
  } else {
    lines.push('<div class="form-group"><label>Десерт:</label> Десерт не выбран</div>');
  }

  lines.push(`<div class="form-group total-cost"><label>Стоимость заказа:</label> ${totalPrice}₽</div>`);
  orderSummary.innerHTML = lines.join('');
}

// Экспортируем для других модулей (например, для страницы заказа)
window.selectedDishes = selectedDishes;
window.saveOrderToStorage = saveOrderToStorage;