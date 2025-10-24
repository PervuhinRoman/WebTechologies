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

// DOM-элементы панели
let checkoutPanel;
let currentTotalEl;
let checkoutLink;

// Загрузка заказа из localStorage
function loadOrderFromStorage() {
  const saved = localStorage.getItem(ORDER_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      selectedDishes = {
        soup: parsed.soup ? getDishByKeyword(parsed.soup) : null,
        'main-course': parsed['main-course'] ? getDishByKeyword(parsed['main-course']) : null,
        drink: parsed.drink ? getDishByKeyword(parsed.drink) : null,
        salad: parsed.salad ? getDishByKeyword(parsed.salad) : null,
        dessert: parsed.dessert ? getDishByKeyword(parsed.dessert) : null
      };
    } catch (e) {
      console.warn('Ошибка при загрузке заказа', e);
    }
  }
}

// Вспомогательная функция: найти блюдо по keyword
function getDishByKeyword(keyword) {
  return window.dishesData.find(d => d.keyword === keyword) || null;
}

// Сохранение заказа в localStorage (только keyword)
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

// Проверка комбо (скопирована из comboHandler.js)
function checkCombo(selected) {
  const { soup, 'main-course': main, salad: starter, drink, dessert } = selected;
  if (soup && main && starter && drink) return true;
  if (soup && main && drink) return true;
  if (soup && starter && drink) return true;
  if (main && starter && drink) return true;
  if (main && drink) return true;
  return false;
}

// Обновление панели оформления
function updateCheckoutPanel() {
  if (!checkoutPanel || !currentTotalEl || !checkoutLink) return;

  const hasAny = Object.values(selectedDishes).some(d => d !== null);
  
  if (!hasAny) {
    checkoutPanel.style.display = 'none';
    return;
  }

  checkoutPanel.style.display = 'block';

  // Считаем общую стоимость
  const total = Object.values(selectedDishes)
    .filter(d => d)
    .reduce((sum, dish) => sum + dish.price, 0);
  
  currentTotalEl.textContent = `${total}₽`;

  // Проверяем комбо
  const isValid = checkCombo(selectedDishes);
  if (isValid) {
    checkoutLink.classList.remove('disabled');
    checkoutLink.setAttribute('aria-disabled', 'false');
  } else {
    checkoutLink.classList.add('disabled');
    checkoutLink.setAttribute('aria-disabled', 'true');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Инициализация DOM-элементов панели
  checkoutPanel = document.getElementById('checkoutPanel');
  currentTotalEl = document.getElementById('currentTotal');
  checkoutLink = document.getElementById('checkoutLink');

  // Загружаем сохранённый заказ
  loadOrderFromStorage();

  // Обработчик клика по карточкам
  document.addEventListener('click', function (e) {
    if (e.target.closest('.dish-card')) {
      const card = e.target.closest('.dish-card');
      const keyword = card.getAttribute('data-dish');

      const dish = window.dishesData.find(d => d.keyword === keyword);
      if (!dish) return;

      const category = dish.category;
      selectedDishes[category] = dish;
      saveOrderToStorage();
      updateCheckoutPanel(); // ← обновляем панель
    }
  });

  // Инициализация панели
  updateCheckoutPanel();
});