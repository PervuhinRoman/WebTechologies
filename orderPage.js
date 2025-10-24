// Загружаем данные о блюдах и восстанавливаем заказ
async function initOrderPage() {
    try {
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const allDishes = await response.json();

        const savedOrder = localStorage.getItem('foodConstructOrder');
        if (!savedOrder) {
            showEmptyOrder();
            return;
        }

        const keywords = JSON.parse(savedOrder);
        const selectedDishes = {};

        for (const [category, keyword] of Object.entries(keywords)) {
            if (keyword) {
                const dish = allDishes.find(d => d.keyword === keyword);
                if (dish) {
                    selectedDishes[category] = dish;
                }
            }
        }

        renderOrderDishes(selectedDishes);
        updateOrderSummary(selectedDishes);

        // Устанавливаем ОДИН обработчик на всю сетку (делегирование)
        setupDeleteDelegation();
    } catch (error) {
        console.error('Ошибка при инициализации страницы заказа:', error);
        document.getElementById('order-dishes-grid').innerHTML =
            `<p style="text-align:center;color:red;">Ошибка загрузки данных.</p>`;
    }
}

function showEmptyOrder() {
    //   // Отображаем в сетке блюд (верх страницы)
    //   const grid = document.getElementById('order-dishes-grid');
    //   grid.innerHTML = `
    //     <div style="grid-column: 1 / -1; text-align: center; padding: 30px; display: none;">
    //       <!-- Этот блок скрыт, потому что основное сообщение — в форме -->
    //     </div>
    //   `;

    const orderSummary = document.getElementById('order-summary');
    orderSummary.innerHTML = `
    <div id="nothing-selected" style="padding: 20px 20px 20px 0px; text-align: center; color: #666;">
      Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу 
      <a href="lunch.html" style="color: #28a745; text-decoration: underline; font-weight: bold;">Собрать ланч</a>.
    </div>
  `;
}

function renderOrderDishes(selectedDishes, allDishes) {
    const grid = document.getElementById('order-dishes-grid');
    grid.innerHTML = '';

    const categories = [
        { key: 'soup', title: 'Суп' },
        { key: 'main-course', title: 'Главное блюдо' },
        { key: 'drink', title: 'Напиток' },
        { key: 'salad', title: 'Салат или стартер' },
        { key: 'dessert', title: 'Десерт' }
    ];

    categories.forEach(cat => {
        const dish = selectedDishes[cat.key];
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.setAttribute('data-category', cat.key);

        if (dish) {
            card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
        <p class="price">${dish.price}₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="btn-delete" data-category="${cat.key}">Удалить</button>
      `;
        } else {
            card.innerHTML = `
        <div style="height: 150px; display: flex; align-items: center; justify-content: center; color: #888;">
          ${cat.title} не выбран
        </div>
        <p class="name" style="text-align: center; margin-top: 10px;">${cat.title}</p>
        <button class="btn-delete" data-category="${cat.key}" disabled>Удалить</button>
      `;
        }

        grid.appendChild(card);
    });
}

function setupDeleteDelegation() {
    const grid = document.getElementById('order-dishes-grid');
    grid.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('btn-delete')) return;

        const category = e.target.dataset.category;
        const card = e.target.closest('.dish-card');

        // Удаляем из localStorage
        const saved = JSON.parse(localStorage.getItem('foodConstructOrder') || '{}');
        saved[category] = null;
        localStorage.setItem('foodConstructOrder', JSON.stringify(saved));

        // Обновляем отображение карточки на "не выбрано"
        const titles = {
            'soup': 'Суп',
            'main-course': 'Главное блюдо',
            'drink': 'Напиток',
            'salad': 'Салат или стартер',
            'dessert': 'Десерт'
        };
        const title = titles[category] || category;

        card.innerHTML = `
      <div style="height: 150px; display: flex; align-items: center; justify-content: center; color: #888;">
        ${title} не выбрано
      </div>
      <p class="name" style="text-align: center; margin-top: 10px;">${title}</p>
      <button class="btn-delete" data-category="${category}" disabled>Удалить</button>
    `;

        // Обновляем сводку заказа
        await updateOrderSummaryFromStorage();
    });
}

async function updateOrderSummaryFromStorage() {
    const saved = JSON.parse(localStorage.getItem('foodConstructOrder') || '{}');
    const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
    const allDishes = await response.json();

    const selected = {};
    for (const [cat, keyword] of Object.entries(saved)) {
        if (keyword) {
            const dish = allDishes.find(d => d.keyword === keyword);
            if (dish) selected[cat] = dish;
        }
    }
    updateOrderSummary(selected);
}

function setupDeleteHandlers(selectedDishes, allDishes) {
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            if (!selectedDishes[category]) return;

            // Удаляем из localStorage
            const saved = JSON.parse(localStorage.getItem('foodConstructOrder') || '{}');
            saved[category] = null;
            localStorage.setItem('foodConstructOrder', JSON.stringify(saved));

            // Удаляем из локального объекта
            delete selectedDishes[category]; // ← это важно!

            // Перерисовываем ВСЁ
            renderOrderDishes(selectedDishes, allDishes);
            updateOrderSummary(selectedDishes);
        });
    });
}

function updateOrderSummary(selectedDishes) {
    const orderSummary = document.getElementById('order-summary');

    const hasSoup = !!selectedDishes.soup;
    const hasMain = !!selectedDishes['main-course'];
    const hasDrink = !!selectedDishes.drink;
    const hasStarter = !!selectedDishes.salad;
    const hasDessert = !!selectedDishes.dessert;

    const hasSelected = hasSoup || hasMain || hasDrink || hasStarter || hasDessert;

    if (!hasSelected) {
        showEmptyOrder();
        return;
    }

    let totalPrice = 0;
    const lines = [];

    const addLine = (label, dish) => {
        if (dish) {
            lines.push(`<div class="form-group"><label>${label}:</label> ${dish.name} — ${dish.price}₽</div>`);
            totalPrice += dish.price;
        } else {
            lines.push(`<div class="form-group"><label>${label}:</label> Не выбрано</div>`);
        }
    };

    addLine('Суп', selectedDishes.soup);
    addLine('Главное блюдо', selectedDishes['main-course']);
    addLine('Салат или стартер', selectedDishes.salad);
    addLine('Напиток', selectedDishes.drink);
    addLine('Десерт', selectedDishes.dessert);

    lines.push(`<div class="form-group total-cost"><label>Стоимость заказа:</label> ${totalPrice}₽</div>`);
    orderSummary.innerHTML = lines.join('');
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initOrderPage);