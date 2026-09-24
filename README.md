# Luxury Beauty — Full Website Clone

A recreation of the "Luxury Beauty" Google Sites store (Home, Skincare, Haircare, Fragrance),
rebuilt as a real multi-tech project using **HTML, CSS, JavaScript, Node.js, MongoDB, PHP and MySQL**.

## Project structure

```
luxury-beauty/
├── frontend/              HTML / CSS / JS (static site, works standalone)
│   ├── index.html         Home page (Our Services)
│   ├── skincare.html      8 real skincare products
│   ├── haircare.html      8 real haircare products
│   ├── fragrance.html     8 real fragrance products
│   ├── contact.html       Contact form (posts to PHP/MySQL)
│   ├── css/style.css
│   └── js/main.js
│
├── backend/                Node.js + Express + MongoDB API
│   ├── server.js           Express app (serves frontend + REST API)
│   ├── config/db.js        Mongoose connection
│   ├── models/Product.js   Product schema
│   ├── routes/products.js  CRUD routes: /api/products
│   ├── seed/products.json  Real product data scraped from the source site
│   ├── seed/seed.js        Script to load products.json into MongoDB
│   └── package.json
│
└── php-sql/                 PHP + MySQL micro-service
    ├── schema.sql            Creates the `luxury_beauty` DB + tables
    ├── db.php                MySQLi connection helper
    ├── newsletter.php        POST endpoint -> newsletter_subscribers table
    └── contact.php           POST endpoint -> contact_messages table
```

## How the pieces fit together

- **Frontend (HTML/CSS/JS)** — fully static and works on its own, with all 24 real
  products (name, image, buy link) already in the HTML. This is what your visitors see.
- **Node.js + Express + MongoDB** — a REST API for the product catalog (`/api/products`).
  The homepage's "Trending in Skincare" section calls this API live; if the backend isn't
  running, the static pages still work fine.
- **PHP + MySQL** — handles the newsletter signup and contact form, storing submissions
  in a MySQL database. This is a separate lightweight service, meant to run on any PHP host.

## 1. Run the static frontend only

Just open `frontend/index.html` in a browser, or serve the folder with any static server:

```bash
cd frontend
npx serve .
```

## 2. Run the Node.js + Express + MongoDB API

Requires Node.js and a running MongoDB instance (local or Atlas).

```bash
cd backend
npm install
cp .env.example .env        # edit MONGO_URI if needed
npm run seed                # loads the 24 real products into MongoDB
npm start                   # starts server on http://localhost:5000
```

Once running, `http://localhost:5000` serves the frontend AND the API:

- `GET /api/products` — all products
- `GET /api/products?category=skincare` — filter by category
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## 3. Run the PHP + MySQL service

Requires PHP with the `mysqli` extension and a MySQL server.

```bash
mysql -u root -p < php-sql/schema.sql

# then, from the php-sql folder:
php -S localhost:8000
```

Set your DB credentials via environment variables (or edit the defaults in `php-sql/db.php`):

```bash
export DB_HOST=127.0.0.1
export DB_NAME=luxury_beauty
export DB_USER=root
export DB_PASS=yourpassword
```

The frontend's newsletter and contact forms POST JSON to `php-sql/newsletter.php`
and `php-sql/contact.php`. If you serve the PHP folder on a different host/port than
the frontend, update `PHP_BASE` in `frontend/js/main.js` to the full URL
(e.g. `http://localhost:8000`).

## Notes

- Product names, images and "Buy Now" affiliate links were taken directly from the
  original site's live catalog so the store content matches exactly.
- The three banner images you supplied are used as the Skincare / Haircare / Fragrance
  category visuals on the homepage and on each category page's hero banner.
- Colors/fonts (black, gold, cream + Playfair Display/Poppins) were chosen to match the
  clean, premium look of the original site — customize `frontend/css/style.css` freely.
