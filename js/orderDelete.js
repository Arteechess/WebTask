async function deleteOrder() {
  const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${currentOrderId}?api_key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });

    if (!response.ok) {
      throw new Error('Произошла ошибка');
    }

    const data = await response.json();
    console.log(data);
    window.location.href = 'account.html';
  } catch (error) {
    console.error(error);
  }
}
