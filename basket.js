const API_URL = 'http://localhost:3000/api/baskets';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDQyOTU1ODc1ZWQxOWE4OWUwM2Q2OSIsImlhdCI6MTczMjczNzcwNCwiZXhwIjoxNzMyNzM4MDA0fQ.6CkKdEhCnASk5fuPxonDs2XlwdBmO8eJvHGLPO6HShM';
const SEARCH_URL = '/search';
const BASKET_URL = '/basket';
const PROFILE_URL = '/profile';
const LOGIN_URL = '/login';

document.getElementById('search-btn').addEventListener('click', () => {
  const searchQuery = document.querySelector('input[placeholder="What are you looking for?"]').value;

  if (!searchQuery) {
    alert('Please enter a search query!');
    return;
  }

  window.location.href = `${SEARCH_URL}?query=${encodeURIComponent(searchQuery)}`;
});

document.getElementById('basket-btn').addEventListener('click', () => {
  window.location.href = BASKET_URL;
});

document.getElementById('profile-btn').addEventListener('click', () => {
  const isAuthenticated = checkAuthentication();

  if (!isAuthenticated) {
    alert('Please log in to access your profile');
    window.location.href = LOGIN_URL;
  } else {
    window.location.href = PROFILE_URL;
  }
});

function checkAuthentication() {
  return !!AUTH_TOKEN && AUTH_TOKEN !== 'Bearer ';
}

function updateProfileIcon() {
  const profileIcon = document.getElementById('profile-btn');
  const iconHTML = checkAuthentication()
    ? `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="#DB4444"/>
        <path d="M21 23V21.3333C21 20.4493 20.691 19.6014 20.1408 18.9763C19.5907 18.3512 18.8446 18 18.0667 18H12.9333C12.1554 18 11.4093 18.3512 10.8592 18.9763C10.309 19.6014 10 20.4493 10 21.3333V23" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 15C17.6569 15 19 13.6569 19 12C19 10.3431 17.6569 9 16 9C14.3431 9 13 10.3431 13 12C13 13.6569 14.3431 15 16 15Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    : `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 27V24.3333C24 22.9188 23.5224 21.5623 22.6722 20.5621C21.8221 19.5619 20.669 19 19.4667 19H11.5333C10.331 19 9.17795 19.5619 8.32778 20.5621C7.47762 21.5623 7 22.9188 7 24.3333V27" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.5 14C18.9853 14 21 11.9853 21 9.5C21 7.01472 18.9853 5 16.5 5C14.0147 5 12 7.01472 12 9.5C12 11.9853 14.0147 14 16.5 14Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  profileIcon.innerHTML = iconHTML;
}

async function updateBasketCount() {
    try {
      const response = await fetch(`${API_URL}/view`, {
        headers: { Authorization: AUTH_TOKEN },
      });
  
      if (response.ok) {
        const data = await response.json();
        const count = data.basket.products.reduce((sum, item) => sum + item.quantity, 0);
        const basketCountElement = document.getElementById('basket-count');
  
        basketCountElement.innerText = count; 
        basketCountElement.style.display = count > 0 ? 'flex' : 'none'; 
      } else {
        console.error('Error item count:', await response.json());
      }
    } catch (error) {
      console.error('Error item count:', error);
    }
  }
  

async function fetchBasket() {
    try {
        const response = await fetch(`${API_URL}/view`, {
            headers: { Authorization: AUTH_TOKEN },
        });

        if (response.ok) {
            const data = await response.json();
            renderBasket(data.basket);
            calculateTotalPrice(); 
            attachRemoveHandlers(); 
        } else {
            console.error('Error Basket:', await response.json());
        }
    } catch (error) {
        console.error('Error Basket:', error);
    }
}

  

function renderBasket(basket) {
  const basketItemsContainer = document.getElementById('basket-items');
  basketItemsContainer.innerHTML = '';

  let totalPrice = 0;

  basket.products.forEach(({ productId, quantity }) => {
    const itemHTML = `
      <div class="bg-white rounded-lg shadow relative p-4">
        <div class="relative">
          <img src="${productId.gallery[0]}" alt="Item image" class="rounded-lg w-full h-64 object-cover mb-4">
            <button class="absolute top-2 right-2 bg-gray-200 text-black p-1 rounded-full remove-item" data-id="${productId._id}">
             <img src="https://s3-alpha-sig.figma.com/img/9913/87c0/5dd6d44594e01b675513068803e2426d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lH7riBAogz5-ncgy5wtuT2wDU2Mftpe80ifBPwQpHK-D0gIU7kg3n~UdAhxZX0fDOcYqfhZlVF14jHZ0MW3CRXtNztxOOZ3dXIZSrRP6hJA2xGk7oqZxopxcnq2TP2JDplkucX7aPaPjREgWTsCWdDnqbwZ9yfUWCvcs6dEdq1sCOIAaiJN6HPwS0nA0XUwFPfpWOY1TeMnP2R5wzN6Td675mb4EfUjETiOQ8M0p8wPrOjt74AJbno2gg-EdrVCFiEozzl0UFbBqTYrnOdr9nt4v-yPo5sRvFpmw0oXh6xYwdTBezj0ktkFh3U3PduzFP1higeLeyS1EYuIVMiqJug__"alt="Remove" class="w-6 h-6">
          </button>        
          </div>
        <div>
          <h3 class="text-lg font-bold">${productId.title}</h3>
          <p class="text-red-500 font-semibold">${productId.price} ${basket.currency}</p>
          <p>Quantity: ${quantity}</p>
        </div>
      </div>
    `;
    basketItemsContainer.innerHTML += itemHTML;
    totalPrice += productId.price * quantity;
  });

  document.getElementById('total-price').innerText = `${totalPrice} ${basket.currency}`;
  attachRemoveHandlers();
}

async function removeFromBasket(productId) {
    try {
        const response = await fetch(`${API_URL}/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: AUTH_TOKEN,
            },
        });

        if (response.ok) {
            const productElement = document.querySelector(`button[data-id="${productId}"]`).closest('.bg-white');
            if (productElement) {
                productElement.remove();
            }

            calculateTotalPrice();
            updateBasketCount();
        } else {
            console.error('Error "Delete":', await response.json());
        }
    } catch (error) {
        console.error('Error "Delete":', error);
    }
}


  




function attachRemoveHandlers() {
    document.querySelectorAll('.remove-item').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const productId = event.target.getAttribute('data-id');
        await removeFromBasket(productId);
      });
    });
  }
  
  

document.getElementById('clear-all').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/clearAll`, {
            method: 'DELETE',
            headers: {
                Authorization: AUTH_TOKEN,
            },
        });

        if (response.ok) {
            document.getElementById('basket-items').innerHTML = ''; 
            document.getElementById('total-price').innerText = '$0'; 
            const basketCountElement = document.getElementById('basket-count');
            basketCountElement.innerText = 0;
            basketCountElement.style.display = 'none'; 
            
        } else {
            console.error('Error "Clean All":', await response.json());
        }
    } catch (error) {
        console.error('Error "Clean All":', error);
    }
});




function calculateTotalPrice() {
    let totalPrice = 0;
    const items = document.querySelectorAll('.bg-white'); 

    items.forEach((item) => {
        const priceText = item.querySelector('.text-red-500')?.textContent || '0';
        const quantityText = item.querySelector('p')?.textContent.match(/Quantity: (\d+)/) || ['1', '1'];

        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0; 
        const quantity = parseInt(quantityText[1], 10); 

        totalPrice += price * quantity; 
    });

    document.getElementById('total-price').innerText = `$${totalPrice.toFixed(2)}`; 
}


  
  
















updateProfileIcon();
updateBasketCount();
fetchBasket();
