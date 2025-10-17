document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.order-form');

  form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    // Получаем выбранные блюда из orderHandler
    const selected = getSelectedDishes();

    // Проверяем, есть ли хоть одно блюдо
    if (!hasAnyDish(selected)) {
      showNotification('Ничего не выбрано. Выберите блюда для заказа');
      return;
    }

    // Проверяем комбо
    const isValidCombo = checkCombo(selected);

    if (!isValidCombo) {
      const message = getMissingMessage(selected);
      showNotification(message);
      return;
    }

    form.submit(); 
  });
});

// Функция для получения выбранных блюд (возвращает объект)
function getSelectedDishes() {
  // Это ссылка на глобальный объект из orderHandler.js
  return selectedDishes;
}

function hasAnyDish(selected) {
  return Object.values(selected).some(dish => dish !== null);
}

// Проверка комбо
function checkCombo(selected) {
  const { soup, main, starter, drink, dessert } = selected;

  // Комбо 1: Суп + Главное + Салат + Напиток
  if (soup && main && starter && drink) return true;

  // Комбо 2: Суп + Главное + Напиток
  if (soup && main && drink) return true;

  // Комбо 3: Суп + Салат + Напиток
  if (soup && starter && drink) return true;

  // Комбо 4: Главное + Салат + Напиток
  if (main && starter && drink) return true;

  // Комбо 5: Главное + Напиток
  if (main && drink) return true;

  return false;
}

function getMissingMessage(selected) {
  const { soup, main, starter, drink, dessert } = selected;

  // Если нет напитка — но есть другие блюда
  if (drink === null && (soup || main || starter)) {
    return 'Выберите напиток';
  }

  // Если есть суп, но нет главного и салата
  if (soup && !main && !starter) {
    return 'Выберите главное блюдо/салат/стартер';
  }

  // Если есть салат, но нет супа и главного
  if (starter && !soup && !main) {
    return 'Выберите суп или главное блюдо';
  }

  // Если есть напиток/десерт, но нет главного
  if (drink && !main && !soup && !starter) {
    return 'Выберите главное блюдо';
  }

  // По умолчанию — "ничего не выбрано" уже обработано выше
  return 'Недостаточно блюд для оформления заказа';
}

// Показ уведомления
function showNotification(message) {
  const existing = document.getElementById('notification-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'notification-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 20px;
  `;

  const notification = document.createElement('div');
  notification.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  `;

  const text = document.createElement('p');
  text.textContent = message;
  text.style.cssText = `
    font-size: 1.1rem;
    margin-bottom: 20px;
    line-height: 1.4;
  `;

  const button = document.createElement('button');
  button.textContent = 'Окей 👌';
  button.style.cssText = `
    padding: 10px 20px;
    border: 2px solid #28a745;
    border-radius: 20px;
    background: none;
    color: #28a745;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#d4edda';
    button.style.color = '#155724';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'none';
    button.style.color = '#28a745';
  });

  button.addEventListener('click', () => {
    overlay.remove();
  });

  notification.appendChild(text);
  notification.appendChild(button);
  overlay.appendChild(notification);

  document.body.appendChild(overlay);
}