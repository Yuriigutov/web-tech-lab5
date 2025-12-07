let categoriesData = [];

function loadCategories() {
  fetch('data/categories.json')
    .then(response => response.json())
    .then(data => {
      categoriesData = data.categories || [];
      renderCategories();
    })
    .catch(() => {
      const categoriesContainer = document.getElementById('categories');
      categoriesContainer.innerHTML =
        '<div class="alert alert-danger">Не вдалося завантажити список категорій.</div>';
    });
}

function renderCategories() {
  const categoriesContainer = document.getElementById('categories');
  categoriesContainer.innerHTML = '';

  categoriesData.forEach(category => {
    const item = document.createElement('a');
    item.href = '#';
    item.className = 'list-group-item list-group-item-action pointer';
    item.dataset.shortname = category.shortname;

    const title = document.createElement('div');
    title.textContent = category.name;
    title.className = 'fw-bold';

    const notes = document.createElement('div');
    notes.textContent = category.notes || '';
    notes.className = 'category-notes';

    item.appendChild(title);
    item.appendChild(notes);

    item.addEventListener('click', function (e) {
      e.preventDefault();
      loadCategory(category.shortname);
    });

    categoriesContainer.appendChild(item);
  });

  const specials = document.createElement('a');
  specials.href = '#';
  specials.className = 'list-group-item list-group-item-action list-group-item-secondary fw-bold text-center pointer';
  specials.textContent = 'Specials (випадкова категорія)';

  specials.addEventListener('click', function (e) {
    e.preventDefault();
    if (!categoriesData.length) return;
    const randomIndex = Math.floor(Math.random() * categoriesData.length);
    const randomCategory = categoriesData[randomIndex];
    loadCategory(randomCategory.shortname);
  });

  categoriesContainer.appendChild(specials);
}

function loadCategory(shortname) {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML =
    '<div class="alert alert-secondary">Завантаження...</div>';

  fetch('data/' + shortname + '.json')
    .then(response => response.json())
    .then(data => {
      renderCategory(data);
    })
    .catch(() => {
      productsContainer.innerHTML =
        '<div class="alert alert-danger">Не вдалося завантажити вміст категорії.</div>';
    });
}

function renderCategory(categoryData) {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = categoryData.categoryName || 'Категорія';
  title.className = 'mb-3';
  productsContainer.appendChild(title);

  const row = document.createElement('div');
  row.className = 'row';

  (categoryData.items || []).forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';

    const card = document.createElement('div');
    card.className = 'card h-100';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.className = 'card-img-top product-image';

    const body = document.createElement('div');
    body.className = 'card-body d-flex flex-column';

    const name = document.createElement('h5');
    name.className = 'card-title';
    name.textContent = product.name;

    const desc = document.createElement('p');
    desc.className = 'card-text flex-grow-1';
    desc.textContent = product.description;

    const price = document.createElement('p');
    price.className = 'card-text fw-bold';
    price.textContent = 'Ціна: ' + product.price;

    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(price);

    card.appendChild(img);
    card.appendChild(body);
    col.appendChild(card);
    row.appendChild(col);
  });

  productsContainer.appendChild(row);
}

document.addEventListener('DOMContentLoaded', function () {
  loadCategories();

  const catalogLink = document.getElementById('catalog-link');
  if (catalogLink) {
    catalogLink.addEventListener('click', function (e) {
      e.preventDefault();
      loadCategories();
      const productsContainer = document.getElementById('products');
      productsContainer.innerHTML =
        '<div class="alert alert-info">Вибери категорію зліва, щоб переглянути товари чи послуги.</div>';
    });
  }
});
