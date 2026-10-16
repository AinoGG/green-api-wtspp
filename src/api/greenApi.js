

/**
 * Отправка текстового сообщения
 */
export const sendMessage = async (credentials, phoneNumber, messageText) => {
  const { idInstance, apiTokenInstance, apiUrl } = credentials;
  
  // Номер телефона в формате WhatsApp ID (например, 79991112233@c.us)
  const chatId = `${phoneNumber}@c.us`;

  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
        message: messageText,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка отправки: ${response.status}`);
    }

    const data = await response.json();
    return data; // Возвращает idMessage
  } catch (error) {
    console.error('Ошибка в sendMessage:', error);
    throw error;
  }
};

/**
 * Получение одного уведомления из очереди (Long Polling)
 */
export const receiveNotification = async (credentials) => {
  const { idInstance, apiTokenInstance, apiUrl } = credentials;

  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Ошибка получения: ${response.status}`);
    }

    // Если очередь пуста, вернется null или пустой ответ
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка в receiveNotification:', error);
    return null;
  }
};

/**
 * Удаление уведомления из очереди после успешной обработки
 */
export const deleteNotification = async (credentials, receiptId) => {
  const { idInstance, apiTokenInstance, apiUrl } = credentials;

  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка удаления: ${response.status}`);
    }

    const data = await response.json();
    return data; // Возвращает { result: true }
  } catch (error) {
    console.error('Ошибка в deleteNotification:', error);
    return null;
  }
};
