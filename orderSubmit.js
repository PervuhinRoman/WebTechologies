// orderSubmit.js

const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
const API_KEY = 'fd0ca332-f6dc-4694-9d19-27e96b8648d0';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.order-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Проверяем комбо (повторно, на случай обхода)
        const selected = await getSelectedDishesFromStorage();
        if (!checkCombo(selected)) {
            showNotification('Заказ не соответствует ни одному комбо. Добавьте недостающие блюда.');
            return;
        }

        // 2. Собираем данные из формы
        const formData = {
            full_name: document.getElementById('full_name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subscribe: document.getElementById('subscribe').checked ? 1 : 0,
            phone: document.getElementById('phone').value.trim(),
            delivery_address: document.getElementById('delivery_address').value.trim(),
            delivery_type: document.querySelector('input[name="delivery_type"]:checked')?.value || 'now',
            delivery_time: null,
            comment: document.getElementById('comment').value.trim() || null
        };

        // Время доставки — только если выбрано "by_time"
        if (formData.delivery_type === 'by_time') {
            const timeInput = document.getElementById('delivery_time').value;
            if (!timeInput) {
                showNotification('Укажите время доставки.');
                return;
            }
            formData.delivery_time = timeInput; // формат HH:MM
        }

        // 3. Добавляем ID блюд
        formData.soup_id = selected.soup?.id || null;
        formData.main_course_id = selected['main-course']?.id || null;
        formData.salad_id = selected.salad?.id || null;
        formData.drink_id = selected.drink?.id || null;
        formData.dessert_id = selected.dessert?.id || null;

        // 4. Проверка обязательных полей (по API)
        if (!formData.full_name || !formData.email || !formData.phone || !formData.delivery_address) {
            showNotification('Заполните все обязательные поля.');
            return;
        }

        if (!formData.drink_id) {
            showNotification('Напиток обязателен.');
            return;
        }

        // 5. Отправка запроса
        try {
            const response = await fetch(`${API_URL}?api_key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || `Ошибка ${response.status}: ${response.statusText}`;
                showNotification(`Ошибка при оформлении заказа: ${errorMsg}`);
                return;
            }

            // 6. Успех!
            localStorage.removeItem('foodConstructOrder');
            showNotification('Заказ успешно оформлен! Спасибо за покупку 🎉', true);

            // Опционально: перенаправить через 2 секунды
            setTimeout(() => {
                window.location.href = 'lunch.html';
            }, 2000);

        } catch (error) {
            console.error('Ошибка сети:', error);
            showNotification('Не удалось подключиться к серверу. Проверьте интернет и попробуйте снова.');
        }
    });
});

// Вспомогательные функции (скопированы из comboHandler.js)

async function getSelectedDishesFromStorage() {
    const saved = localStorage.getItem('foodConstructOrder');
    if (!saved) {
        return { soup: null, 'main-course': null, drink: null, salad: null, dessert: null };
    }

    try {
        const keywords = JSON.parse(saved);
        const res = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
        const allDishes = await res.json();

        const selected = {
            soup: null,
            'main-course': null,
            drink: null,
            salad: null,
            dessert: null
        };

        for (const [cat, keyword] of Object.entries(keywords)) {
            if (keyword) {
                const dish = allDishes.find(d => d.keyword === keyword);
                if (dish) selected[cat] = dish;
            }
        }
        return selected;
    } catch (e) {
        return { soup: null, 'main-course': null, drink: null, salad: null, dessert: null };
    }
}

function checkCombo(selected) {
    const { soup, 'main-course': main, salad: starter, drink } = selected;
    return (soup && main && starter && drink) ||
        (soup && main && drink) ||
        (soup && starter && drink) ||
        (main && starter && drink) ||
        (main && drink);
}

// Кастомное уведомление (как в comboHandler.js)
function showNotification(message, isSuccess = false) {
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
    padding: 20px;`;

    const notification = document.createElement('div');
    notification.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);`;

    const text = document.createElement('p');
    text.textContent = message;
    text.style.cssText = `
    font-size: 1.1rem;
    margin-bottom: 20px;
    line-height: 1.4;
    color: ${isSuccess ? '#28a745' : '#e74c3c'};`;

    const button = document.createElement('button');
    button.textContent = 'Окей 👌';
    button.style.cssText = `
    padding: 10px 20px;
    border: 2px solid ${isSuccess ? '#28a745' : '#e74c3c'};
    border-radius: 20px;
    background: none;
    color: ${isSuccess ? '#28a745' : '#e74c3c'};
    font-size: 1rem;
    cursor: pointer;`;

    button.addEventListener('click', () => overlay.remove());

    notification.appendChild(text);
    notification.appendChild(button);
    overlay.appendChild(notification);
    document.body.appendChild(overlay);
}