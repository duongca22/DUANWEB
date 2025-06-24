function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartBody = document.getElementById('cart-body');
  cartBody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const quantity = item.qty || 1;
    const itemTotal = item.price * quantity;
    total += itemTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" /></td>
      <td>${item.name}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>
        <input type="number" min="1" value="${quantity}" onchange="updateQuantity(${index}, this.value)" />
      </td>
      <td>${formatCurrency(itemTotal)}</td>
      <td><button onclick="removeItem(${index})">X</button></td>
    `;
    cartBody.appendChild(row);
  });

  document.getElementById('total-price').textContent = formatCurrency(total);
}

function updateQuantity(index, quantity) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const qty = parseInt(quantity);

  if (isNaN(qty) || qty < 1) {
    alert("Vui lòng nhập số lượng hợp lệ!");
    return;
  }

  cart[index].qty = qty; // sửa lại đúng thuộc tính
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function formatCurrency(number) {
  return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

window.onload = loadCart;
