// displayDishes.js

document.addEventListener('DOMContentLoaded', function() {
  const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

  // По категориям
  const soups = sortedDishes.filter(dish => dish.category === 'soup');
  const mains = sortedDishes.filter(dish => dish.category === 'main');
  const drinks = sortedDishes.filter(dish => dish.category === 'drink');

  // Функция для создания карточки
  function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);

    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <p class="price">${dish.price}₽</p>
      <p class="name">${dish.name}</p>
      <p class="weight">${dish.count}</p>
      <button>Добавить</button>
    `;

    return card;
  }

  // Супы
  const soupSection = document.querySelector('section:nth-of-type(1) .dishes-grid');
  soups.forEach(dish => {
    const card = createDishCard(dish);
    soupSection.appendChild(card);
  });

  // Основные блюда
  const mainSection = document.querySelector('section:nth-of-type(2) .dishes-grid');
  mains.forEach(dish => {
    const card = createDishCard(dish);
    mainSection.appendChild(card);
  });

  // Напитки
  const drinkSection = document.querySelector('section:nth-of-type(3) .dishes-grid');
  drinks.forEach(dish => {
    const card = createDishCard(dish);
    drinkSection.appendChild(card);
  });
});