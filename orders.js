// orders.js

const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
const API_KEY = 'fd0ca332-f6dc-4694-9d19-27e96b8648d0';

document.addEventListener('DOMContentLoaded', loadOrders);

async function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '<tr><td colspan="6" class="loading">Загрузка заказов...</td></tr>';

    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const orders = await response.json();

        // Сортируем по дате (новые — вверху)
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (orders.length === 0) {
            ordersList.innerHTML = `
                <tr>
                <td colspan="6" style="text-align: center; padding: 30px;">
                    У вас пока нет заказов.
                </td>
                </tr>
            `;
            return;
        }

        // Загружаем все блюда для отображения названий
        const dishesResponse = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
        const allDishes = await dishesResponse.json();
        const dishMap = {};
        allDishes.forEach(dish => {
            dishMap[dish.id] = dish.name;
        });

        let html = '';
        orders.forEach((order, index) => {
            const orderNumber = index + 1;
            const date = new Date(order.created_at).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Состав заказа
            const items = [];
            if (order.soup_id && dishMap[order.soup_id]) items.push(dishMap[order.soup_id]);
            if (order.main_course_id && dishMap[order.main_course_id]) items.push(dishMap[order.main_course_id]);
            if (order.salad_id && dishMap[order.salad_id]) items.push(dishMap[order.salad_id]);
            if (order.drink_id && dishMap[order.drink_id]) items.push(dishMap[order.drink_id]);
            if (order.dessert_id && dishMap[order.dessert_id]) items.push(dishMap[order.dessert_id]);

            const composition = items.join(', ');

            // Время доставки
            let deliveryTime = 'Как можно скорее (с 07:00 до 23:00)';
            if (order.delivery_type === 'by_time' && order.delivery_time) {
                deliveryTime = order.delivery_time;
            } else if (order.delivery_type === 'now') {
                deliveryTime = 'Как можно скорее (с 07:00 до 23:00)';
            }

            // Стоимость (если не указано — рассчитываем по ID блюд)
            let total = 0;
            if (order.soup_id && dishMap[order.soup_id]) {
                const dish = allDishes.find(d => d.id === order.soup_id);
                if (dish) total += dish.price;
            }
            if (order.main_course_id && dishMap[order.main_course_id]) {
                const dish = allDishes.find(d => d.id === order.main_course_id);
                if (dish) total += dish.price;
            }
            if (order.salad_id && dishMap[order.salad_id]) {
                const dish = allDishes.find(d => d.id === order.salad_id);
                if (dish) total += dish.price;
            }
            if (order.drink_id && dishMap[order.drink_id]) {
                const dish = allDishes.find(d => d.id === order.drink_id);
                if (dish) total += dish.price;
            }
            if (order.dessert_id && dishMap[order.dessert_id]) {
                const dish = allDishes.find(d => d.id === order.dessert_id);
                if (dish) total += dish.price;
            }

            html += `
            <tr>
                <td>${orderNumber}</td>
                <td>${date}</td>
                <td>${composition}</td>
                <td>${total}₽</td>
                <td>${deliveryTime}</td>
                <td class="action-icons">
                    <button title="Подробнее" onclick="showOrderDetails(${order.id})">👁️</button>
                    <button title="Редактировать" onclick="editOrder(${order.id})">✏️</button>
                    <button class="delete-btn" title="Удалить" onclick="deleteOrder(${order.id})">🗑️</button>
                </td>
                </tr>
            `;
        });

        ordersList.innerHTML = html;

    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        ordersList.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 30px; color: red;">
                Ошибка загрузки данных. Попробуйте позже.
            </td>
        </tr>
    `;
    }
}

// Функции для действий (заглушка, можно расширить)
function showOrderDetails(id) {
    alert(`Просмотр заказа #${id}`);
}

function editOrder(id) {
    alert(`Редактирование заказа #${id}`);
}

function deleteOrder(id) {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
        // Реализация удаления через DELETE запрос
        fetch(`${API_URL}/${id}?api_key=${API_KEY}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    alert('Заказ успешно удалён.');
                    loadOrders(); // Обновляем список
                } else {
                    alert('Не удалось удалить заказ.');
                }
            })
            .catch(err => {
                console.error('Ошибка удаления:', err);
                alert('Ошибка сети при удалении заказа.');
            });
    }
}