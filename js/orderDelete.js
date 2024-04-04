function deleteOrder () {
  const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + currentOrderId + '?api_key=' + API_KEY

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Произошла ошибка')
      }
      return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.href = 'account.html'
    })
}
