document.addEventListener('DOMContentLoaded', function() {
  // Обработчик клика по фильтру
  document.addEventListener('click', function(e) {
    if (e.target.matches('.filters button')) {
      const button = e.target;
      const kind = button.getAttribute('data-kind');
      const section = button.closest('section');
      const category = section.querySelector('h2').textContent.toLowerCase().includes('суп') ? 'soup' :
                      section.querySelector('h2').textContent.toLowerCase().includes('главное') ? 'main' :
                      section.querySelector('h2').textContent.toLowerCase().includes('напиток') ? 'drink' :
                      section.querySelector('h2').textContent.toLowerCase().includes('салат') ? 'starter' : 'dessert';

      // Переключаем класс active
      const filters = section.querySelectorAll('.filters button');
      filters.forEach(btn => btn.classList.remove('active'));
      if (!button.classList.contains('active')) {
        button.classList.add('active');
      }

      // Фильтруем блюда
      let filteredDishes = dishes.filter(dish => dish.category === category);
      if (button.classList.contains('active')) {
        filteredDishes = filteredDishes.filter(dish => dish.kind === kind);
      }

      // Пересортируем и отображаем
      const sortedFiltered = [...filteredDishes].sort((a, b) => a.name.localeCompare(b.name));
      const grid = section.querySelector('.dishes-grid');
      grid.innerHTML = '';

      sortedFiltered.forEach(dish => {
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
        grid.appendChild(card);
      });
    }
  });
});