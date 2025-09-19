document.addEventListener('DOMContentLoaded', function() {
    const logoBtn = document.getElementById('logo-btn');
    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('close-modal');
    const serverInfo = document.getElementById('server-info');
    const serverStatus = document.getElementById('server-status');

    // Обработчик клика по логотипу
    logoBtn.addEventListener('click', function() {
        modal.classList.add('active');
        fetchServerInfo();
    });

    // Закрытие модального окна
    closeButton.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    // Закрытие при клике вне области контента
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Проверка статуса сервера при загрузке
    checkServerStatus();

    // Функция для проверки статуса сервера
    async function checkServerStatus() {
        try {
            const response = await fetch('/.netlify/functions/server-status');
            const data = await response.json();

            if (data.online) {
                serverStatus.innerHTML = `<div class="status-online">${data.message}</div>`;
            } else {
                serverStatus.innerHTML = `<div class="status-offline">${data.message}</div>`;
            }
        } catch (error) {
            serverStatus.innerHTML = '<div class="status-offline">Ошибка при проверке статуса сервера</div>';
            console.error('Error:', error);
        }
    }

    // Функция для получения информации о сервере
    async function fetchServerInfo() {
        serverInfo.innerHTML = '<div class="loading">Загрузка информации о сервере...</div>';

        // Для Netlify используем статические данные
        const serverData = [
            { title: "Статус сервера", value: "Онлайн" },
            { title: "IP адрес", value: "tcp.cloudpub.ru:27271" },
            { title: "Версия", value: "1.19.2" },
            { title: "Режим", value: "Выживание" },
            { title: "Владелец", value: "REMQ" }
        ];

        displayServerInfo(serverData);
    }

    // Функция для отображения информации о сервере
    function displayServerInfo(data) {
        if (!data || data.length === 0) {
            serverInfo.innerHTML = '<div class="error">Не удалось загрузить информацию о сервере</div>';
            return;
        }

        let html = '';
        data.forEach((item, index) => {
            html += `
                <div class="info-item">
                    <h3>${item.title}</h3>
                    <p>${item.value}</p>
                </div>
            `;
        });

        serverInfo.innerHTML = html;
    }
});