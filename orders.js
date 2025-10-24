// orders.js

// Глобальная переменная
let dishesData = null;

async function ensureDishesLoaded() {
    if (dishesData) return dishesData;

    const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
    dishesData = await response.json();
    return dishesData;
}

const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
const API_KEY = 'fd0ca332-f6dc-4694-9d19-27e96b8648d0';

document.addEventListener('DOMContentLoaded', loadOrders);

// Элементы модалок
const viewModal = document.getElementById('viewModal');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');

const closeButtons = document.querySelectorAll('.close');
const okButton = document.querySelector('.btn-ok');
const cancelButton = document.querySelector('.btn-cancel');
const deleteCancelButton = document.getElementById('id-btn-cancel');
const saveButton = document.querySelector('.btn-save');
const deleteConfirmButton = document.querySelector('.btn-delete-confirm');

// Форма редактирования
const editOrderForm = document.getElementById('editOrderForm');
const editOrderIdInput = document.getElementById('editOrderId');
const editCreatedAtSpan = document.getElementById('editCreatedAt');
const editFullNameInput = document.getElementById('editFullName');
const editDeliveryAddressInput = document.getElementById('editDeliveryAddress');
const editNowRadio = document.getElementById('editNow');
const editByTimeRadio = document.getElementById('editByTime');
const editDeliveryTimeInput = document.getElementById('editDeliveryTime');
const editPhoneInput = document.getElementById('editPhone');
const editEmailInput = document.getElementById('editEmail');
const editCommentInput = document.getElementById('editComment');
const editCompositionDiv = document.getElementById('editComposition');
const editTotalPriceSpan = document.getElementById('editTotalPrice');

// Инициализация событий для модалок
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        viewModal.style.display = 'none';
        editModal.style.display = 'none';
        deleteModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === viewModal) viewModal.style.display = 'none';
    if (e.target === editModal) editModal.style.display = 'none';
    if (e.target === deleteModal) deleteModal.style.display = 'none';
});

okButton.addEventListener('click', () => {
    viewModal.style.display = 'none';
});

cancelButton.addEventListener('click', () => {
    editModal.style.display = 'none';
    deleteModal.style.display = 'none';
});

deleteCancelButton.addEventListener('click', () => {
    editModal.style.display = 'none';
    deleteModal.style.display = 'none';
});

saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    saveEditedOrder();
});

deleteConfirmButton.addEventListener('click', () => {
    deleteSelectedOrder();
});

editOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveEditedOrder();
});

// Слушатель изменения радио-кнопок времени доставки
editNowRadio.addEventListener('change', () => {
    editDeliveryTimeInput.disabled = true;
});
editByTimeRadio.addEventListener('change', () => {
    editDeliveryTimeInput.disabled = false;
});

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
            dishMap[dish.id + '_price'] = dish.price; // Для стоимости
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

            // Стоимость
            let total = 0;
            [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id].forEach(id => {
                if (id && dishMap[id + '_price']) {
                    total += dishMap[id + '_price'];
                }
            });

            html += `
        <tr>
          <td>${orderNumber}</td>
          <td>${date}</td>
          <td>${composition}</td>
          <td>${total}₽</td>
          <td>${deliveryTime}</td>
          <td class="action-icons">
            <button title="Подробнее" onclick="showOrderDetails(${order.id})">👁️</button>
            <button title="Редактировать" onclick="showEditOrder(${order.id})">✏️</button>
            <button class="delete-btn" title="Удалить" onclick="showDeleteOrder(${order.id})">🗑️</button>
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

async function showOrderDetails(orderId) {
    try {
        // Загружаем данные заказа
        const orderRes = await fetch(`${API_URL}/${orderId}?api_key=${API_KEY}`);
        const order = await orderRes.json();

        // Гарантируем, что блюда загружены
        await ensureDishesLoaded();

        // Формируем состав
        const items = [];
        if (order.soup_id) items.push({ label: 'Суп', id: order.soup_id });
        if (order.main_course_id) items.push({ label: 'Главное блюдо', id: order.main_course_id });
        if (order.salad_id) items.push({ label: 'Салат', id: order.salad_id });
        if (order.drink_id) items.push({ label: 'Напиток', id: order.drink_id });
        if (order.dessert_id) items.push({ label: 'Десерт', id: order.dessert_id });

        let compositionHtml = '';
        items.forEach(item => {
            const name = getDishNameById(item.id);
            const price = getDishPriceById(item.id);
            if (name) {
                compositionHtml += `<div><strong>${item.label}:</strong> ${name} (${price}₽)</div>`;
            }
        });

        // Форматируем дату
        const date = new Date(order.created_at).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const deliveryTimeText = order.delivery_type === 'by_time' && order.delivery_time
            ? order.delivery_time
            : 'Как можно скорее (с 07:00 до 23:00)';

        const details = document.getElementById('viewOrderDetails');
        details.innerHTML = `
      <div class="form-group">
        <label>Дата оформления</label>
        <span>${date}</span>
      </div>
      <div class="form-group">
        <label>Доставка</label>
        <div>
          <strong>Имя получателя:</strong> ${escapeHtml(order.full_name)}<br>
          <strong>Адрес доставки:</strong> ${escapeHtml(order.delivery_address)}<br>
          <strong>Время доставки:</strong> ${escapeHtml(deliveryTimeText)}<br>
          <strong>Телефон:</strong> ${escapeHtml(order.phone)}<br>
          <strong>Email:</strong> ${escapeHtml(order.email)}
        </div>
      </div>
      <div class="form-group">
        <label>Комментарий</label>
        <div>${order.comment ? escapeHtml(order.comment) : '—'}</div>
      </div>
      <div class="form-group">
        <label>Состав заказа</label>
        ${compositionHtml || '<div>—</div>'}
      </div>
      <div class="form-group">
        <strong>Стоимость:</strong> ${getTotalPrice(order)}₽
      </div>
    `;

        viewModal.style.display = 'block';
    } catch (err) {
        console.error('Ошибка при отображении деталей заказа:', err);
        showNotification('Не удалось загрузить детали заказа.');
    }
}

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showEditOrder(orderId) {
    fetch(`${API_URL}/${orderId}?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(order => {
            editOrderIdInput.value = order.id;
            editCreatedAtSpan.textContent = new Date(order.created_at).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            editFullNameInput.value = order.full_name;
            editDeliveryAddressInput.value = order.delivery_address;
            editPhoneInput.value = order.phone;
            editEmailInput.value = order.email;
            editCommentInput.value = order.comment || '';

            // Время доставки
            if (order.delivery_type === 'now') {
                editNowRadio.checked = true;
                editByTimeRadio.checked = false;
                editDeliveryTimeInput.disabled = true;
                editDeliveryTimeInput.value = '';
            } else {
                editNowRadio.checked = false;
                editByTimeRadio.checked = true;
                editDeliveryTimeInput.disabled = false;
                editDeliveryTimeInput.value = order.delivery_time || '';
            }

            // Состав и стоимость
            let compositionHtml = '';
            const dishIds = [
                { id: order.soup_id, name: 'Суп' },
                { id: order.main_course_id, name: 'Главное блюдо' },
                { id: order.salad_id, name: 'Салат' },
                { id: order.drink_id, name: 'Напиток' },
                { id: order.dessert_id, name: 'Десерт' }
            ];

            dishIds.forEach(item => {
                if (item.id) {
                    const dishName = getDishNameById(item.id);
                    const price = getDishPriceById(item.id);
                    if (dishName) {
                        compositionHtml += `<div><strong>${item.name}:</strong> ${dishName} (${price}₽)</div>`;
                    }
                }
            });

            editCompositionDiv.innerHTML = compositionHtml;
            editTotalPriceSpan.textContent = `${getTotalPrice(order)}₽`;

            editModal.style.display = 'block';
        })
        .catch(err => {
            showNotification('Не удалось загрузить данные заказа для редактирования.');
        });
}

function showDeleteOrder(orderId) {
    deleteModal.style.display = 'block';
    deleteConfirmButton.onclick = () => {
        deleteSelectedOrder(orderId);
    };
}

function deleteSelectedOrder(orderId) {
    fetch(`${API_URL}/${orderId}?api_key=${API_KEY}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                showNotification('Заказ успешно удалён.', true);
                deleteModal.style.display = 'none';
                loadOrders(); // Обновляем список
            } else {
                return res.json().then(data => {
                    throw new Error(data.error || `Ошибка ${res.status}`);
                });
            }
        })
        .catch(err => {
            showNotification(`Ошибка при удалении заказа: ${err.message}`);
        });
}

function saveEditedOrder() {
    const orderId = editOrderIdInput.value;
    const data = {
        full_name: editFullNameInput.value.trim(),
        email: editEmailInput.value.trim(),
        phone: editPhoneInput.value.trim(),
        delivery_address: editDeliveryAddressInput.value.trim(),
        delivery_type: editNowRadio.checked ? 'now' : 'by_time',
        delivery_time: editByTimeRadio.checked ? editDeliveryTimeInput.value : null,
        comment: editCommentInput.value.trim() || null
    };

    // Валидация
    if (!data.full_name || !data.email || !data.phone || !data.delivery_address) {
        showNotification('Заполните все обязательные поля.');
        return;
    }

    if (data.delivery_type === 'by_time' && !data.delivery_time) {
        showNotification('Укажите время доставки.');
        return;
    }

    fetch(`${API_URL}/${orderId}?api_key=${API_KEY}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                showNotification('Заказ успешно изменён.', true);
                editModal.style.display = 'none';
                loadOrders(); // Обновляем список
            } else {
                return res.json().then(data => {
                    throw new Error(data.error || `Ошибка ${res.status}`);
                });
            }
        })
        .catch(err => {
            showNotification(`Ошибка при сохранении изменений: ${err.message}`);
        });
}

// Вспомогательные функции
function getDishNameById(id) {
    if (!dishesData) return '';
    const dish = dishesData.find(d => d.id === id);
    return dish ? dish.name : '';
}

function getDishPriceById(id) {
    if (!dishesData) return 0;
    const dish = dishesData.find(d => d.id === id);
    return dish ? dish.price : 0;
}

function getTotalPrice(order) {
    if (!dishesData) return 0;
    let total = 0;
    [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id]
        .filter(id => id)
        .forEach(id => {
            const dish = dishesData.find(d => d.id === id);
            if (dish) total += dish.price;
        });
    return total;
}

// Кастомное уведомление (копия из comboHandler.js)
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
    color: ${isSuccess ? '#28a745' : '#e74c3c'};
  `;

    const button = document.createElement('button');
    button.textContent = 'Окей 👌';
    button.style.cssText = `
    padding: 10px 20px;
    border: 2px solid ${isSuccess ? '#28a745' : '#e74c3c'};
    border-radius: 20px;
    background: none;
    color: ${isSuccess ? '#28a745' : '#e74c3c'};
    font-size: 1rem;
    cursor: pointer;
  `;

    button.addEventListener('click', () => overlay.remove());

    notification.appendChild(text);
    notification.appendChild(button);
    overlay.appendChild(notification);
    document.body.appendChild(overlay);
}