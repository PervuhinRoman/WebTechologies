// Глобальная переменная для хранения загруженных блюд
window.dishesData = [];

async function loadDishes() {
  try {
    const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const dishes = await response.json();
    window.dishesData = dishes;

    displayDishes(dishes);
  } catch (error) {
    console.error('Не удалось загрузить блюда:', error);
    document.body.innerHTML += `<div style="color:red;text-align:center;padding:20px;">Ошибка загрузки меню. Попробуйте позже.</div>`;
  }
}

function displayDishes(dishes) {
  const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

  const soups = sortedDishes.filter(dish => dish.category === 'soup');
  const mains = sortedDishes.filter(dish => dish.category === 'main-course');
  const drinks = sortedDishes.filter(dish => dish.category === 'drink');
  const starters = sortedDishes.filter(dish => dish.category === 'salad');
  const desserts = sortedDishes.filter(dish => dish.category === 'dessert');

  function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);

    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
      <p class="price">${dish.price}₽</p>
      <p class="name">${dish.name}</p>
      <p class="weight">${dish.count}</p>
      <button>Добавить</button>
    `;

    return card;
  }

  function renderDishes(sectionIndex, dishesArray) {
    const sections = document.querySelectorAll('section');
    if (sectionIndex >= sections.length) return;

    const section = sections[sectionIndex];
    const grid = section.querySelector('.dishes-grid');
    if (!grid) return;

    grid.innerHTML = '';
    dishesArray.forEach(dish => {
      const card = createDishCard(dish);
      grid.appendChild(card);
    });
  }

  // Порядок категорий
  renderDishes(0, soups);      
  renderDishes(1, mains);      
  renderDishes(2, drinks);     
  renderDishes(3, starters);   
  renderDishes(4, desserts);   
}

// Запускаем загрузку при готовности DOM
document.addEventListener('DOMContentLoaded', loadDishes);