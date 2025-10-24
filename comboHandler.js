document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.order-form');
  if (!form) return; // Защита, если формы нет

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Получаем выбранные блюда из localStorage
    const selected = await getSelectedDishesFromStorage();

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

    // Если всё ок — отправляем форму
    form.submit();
  });
});

// Загружаем выбранные блюда из localStorage + API
async function getSelectedDishesFromStorage() {
  const saved = localStorage.getItem('foodConstructOrder');
  if (!saved) {
    return { soup: null, 'main-course': null, drink: null, salad: null, dessert: null };
  }

  try {
    const keywords = JSON.parse(saved);
    const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
    const allDishes = await response.json();

    const selected = {
      soup: null,
      'main-course': null,
      drink: null,
      salad: null,
      dessert: null
    };

    for (const [category, keyword] of Object.entries(keywords)) {
      if (keyword && allDishes) {
        const dish = allDishes.find(d => d.keyword === keyword);
        if (dish) selected[category] = dish;
      }
    }

    return selected;
  } catch (error) {
    console.error('Ошибка при загрузке данных для проверки комбо:', error);
    return { soup: null, 'main-course': null, drink: null, salad: null, dessert: null };
  }
}

function hasAnyDish(selected) {
  return Object.values(selected).some(dish => dish !== null);
}

// Проверка комбо (без изменений)
function checkCombo(selected) {
  const { soup, 'main-course': main, salad: starter, drink, dessert } = selected;

  if (soup && main && starter && drink) return true;
  if (soup && main && drink) return true;
  if (soup && starter && drink) return true;
  if (main && starter && drink) return true;
  if (main && drink) return true;

  return false;
}

function getMissingMessage(selected) {
  const { soup, 'main-course': main, salad: starter, drink, dessert } = selected;

  if (drink === null && (soup || main || starter)) {
    return 'Выберите напиток';
  }
  if (soup && !main && !starter) {
    return 'Выберите главное блюдо/салат/стартер';
  }
  if (starter && !soup && !main) {
    return 'Выберите суп или главное блюдо';
  }
  if (drink && !main && !soup && !starter) {
    return 'Выберите главное блюдо';
  }
  return 'Недостаточно блюд для оформления заказа';
}

// Функция showNotification (без изменений)
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