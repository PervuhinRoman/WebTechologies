document.addEventListener('DOMContentLoaded', function() {
  const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

  // Разделяем по категориям
  const soups = sortedDishes.filter(dish => dish.category === 'soup');
  const mains = sortedDishes.filter(dish => dish.category === 'main');
  const drinks = sortedDishes.filter(dish => dish.category === 'drink');
  const starters = sortedDishes.filter(dish => dish.category === 'starter');
  const desserts = sortedDishes.filter(dish => dish.category === 'dessert');

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

  // Функция для отображения блюд в секции
  function renderDishes(sectionIndex, dishesArray) {
    const section = document.querySelectorAll('section')[sectionIndex];
    const grid = section.querySelector('.dishes-grid');
    grid.innerHTML = ''; // Очищаем

    dishesArray.forEach(dish => {
      const card = createDishCard(dish);
      grid.appendChild(card);
    });
  }

  // Отображаем все категории
  renderDishes(0, soups);
  renderDishes(1, mains);
  renderDishes(2, drinks);
  renderDishes(3, starters);
  renderDishes(4, desserts);
});