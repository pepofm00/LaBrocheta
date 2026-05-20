/* ══════════════════════════════════════════
   PRODUCTOS
══════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 1,
    name: "Mix Pollo",
    desc: "Pack x5 unidades",
    price: 16900,
    emoji: "🍗",
    gradient: "linear-gradient(145deg, #92400e, #d97706)",
  },
  {
    id: 2,
    name: "Mix Ternera",
    desc: "Pack x5 unidades",
    price: 25900,
    emoji: "🥩",
    gradient: "linear-gradient(145deg, #7f1d1d, #b91c1c)",
  },
  {
    id: 3,
    name: "Mixtas Ternera/Pollo",
    desc: "Pack x5 unidades",
    price: 22700,
    emoji: "🍢",
    gradient: "linear-gradient(145deg, #6b2111, #a3390a)",
  },
  {
    id: 4,
    name: "Mix Bondiola",
    desc: "Pack x5 unidades",
    price: 18900,
    emoji: "🐷",
    gradient: "linear-gradient(145deg, #6b1a3a, #be185d)",
  },
  {
    id: 5,
    name: "Mix Lomo",
    desc: "Pack x5 unidades",
    price: 39000,
    emoji: "🥩",
    gradient: "linear-gradient(145deg, #1c1917, #57534e)",
  },
  {
    id: 6,
    name: "Mix Veggie",
    desc: "Pack x5 unidades",
    price: 9800,
    emoji: "🥦",
    gradient: "linear-gradient(145deg, #14532d, #16a34a)",
  },
  {
    id: 7,
    name: "Papines",
    desc: "Pack x5 unidades",
    price: 9500,
    emoji: "🥔",
    gradient: "linear-gradient(145deg, #713f12, #ca8a04)",
  },
  {
    id: 8,
    name: "Al Pincho Queijo Coalho",
    desc: "Pack x5 unidades",
    price: 8900,
    emoji: "🧀",
    gradient: "linear-gradient(145deg, #854d0e, #eab308)",
  },
];

/* Número de WhatsApp: +54 9 11 5827-4540 */
const WA_NUMBER = "5491158274540";
const STORAGE_KEY = "la-brocheta-cart";

/* ══════════════════════════════════════════
   ESTADO DEL CARRITO
══════════════════════════════════════════ */
let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

/* ══════════════════════════════════════════
   UTILIDADES
══════════════════════════════════════════ */
function formatPrice(amount) {
  /* Formato argentino: $16.900 */
  return "$" + amount.toLocaleString("es-AR");
}

function getCartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getCartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);
}

function getCartItems() {
  return Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === Number(id)), qty }))
    .filter((item) => item.product);
}

/* ══════════════════════════════════════════
   RENDER: GRILLA DE PRODUCTOS
══════════════════════════════════════════ */
function renderProducts() {
  const grid = document.getElementById("productsGrid");

  grid.innerHTML = PRODUCTS.map((p) => {
    const qty = cart[p.id] || 0;
    const actionsHTML =
      qty === 0
        ? `<button class="add-btn" data-action="add" data-id="${p.id}">+ Agregar</button>`
        : `<div class="qty-controls">
             <button class="qty-btn qty-minus" data-action="decrease" data-id="${p.id}" aria-label="Restar">−</button>
             <span class="qty-value">${qty}</span>
             <button class="qty-btn qty-plus"  data-action="increase" data-id="${p.id}" aria-label="Sumar">+</button>
           </div>`;

    return `
      <article class="product-card">
        <div class="product-img" style="background:${p.gradient}">
          ${p.emoji}
        </div>
        <div class="product-info">
          <span class="product-name">${p.name}</span>
          <span class="product-desc">${p.desc}</span>
          <span class="product-price">${formatPrice(p.price)}</span>
        </div>
        <div class="product-actions">
          ${actionsHTML}
        </div>
      </article>`;
  }).join("");
}

/* ══════════════════════════════════════════
   RENDER: CARRITO
══════════════════════════════════════════ */
function renderCart() {
  const items = getCartItems();
  const emptyEl = document.getElementById("cartEmpty");
  const listEl = document.getElementById("cartItemsList");
  const footerEl = document.getElementById("cartFooter");
  const totalEl = document.getElementById("cartTotalAmount");

  if (items.length === 0) {
    emptyEl.classList.remove("hidden");
    listEl.innerHTML = "";
    footerEl.classList.add("hidden");
    return;
  }

  emptyEl.classList.add("hidden");
  footerEl.classList.remove("hidden");
  totalEl.textContent = formatPrice(getCartTotal());

  listEl.innerHTML = items.map(({ product: p, qty }) => `
    <li class="cart-item">
      <div class="cart-item-img" style="background:${p.gradient}">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-subtotal">${formatPrice(p.price * qty)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-item-btn" data-action="decrease" data-id="${p.id}" aria-label="Restar">−</button>
        <span class="cart-item-qty">${qty}</span>
        <button class="cart-item-btn" data-action="increase" data-id="${p.id}" aria-label="Sumar">+</button>
      </div>
    </li>`).join("");
}

/* ══════════════════════════════════════════
   ACTUALIZAR UI (badge + barra sticky)
══════════════════════════════════════════ */
function updateUI() {
  const count = getCartCount();
  const total = getCartTotal();

  /* Badge del header */
  const badge = document.getElementById("cartBadge");
  if (count > 0) {
    badge.textContent = count > 99 ? "99+" : count;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }

  /* Barra sticky */
  const stickyBar = document.getElementById("stickyBar");
  if (count > 0) {
    document.getElementById("stickyCount").textContent =
      count === 1 ? "1 producto" : `${count} productos`;
    document.getElementById("stickyTotal").textContent = formatPrice(total);
    stickyBar.classList.remove("hidden");
  } else {
    stickyBar.classList.add("hidden");
  }
}

/* ══════════════════════════════════════════
   OPERACIONES DEL CARRITO
══════════════════════════════════════════ */
function addItem(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  refresh(id);
  showToast("✓ Agregado al carrito");
}

function increaseItem(id) {
  if ((cart[id] || 0) >= 20) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  refresh(id);
}

function decreaseItem(id) {
  if (!cart[id]) return;
  if (cart[id] > 1) {
    cart[id]--;
  } else {
    delete cart[id];
  }
  saveCart();
  refresh(id);
}

function clearCart() {
  cart = {};
  saveCart();
  renderProducts();
  renderCart();
  updateUI();
  showToast("Carrito vaciado");
}

/* Actualiza la card individual + carrito + UI */
function refresh(id) {
  updateCardActions(id);
  renderCart();
  updateUI();
}

/* Actualiza solo la sección de acciones de una card (sin re-renderizar toda la grilla) */
function updateCardActions(id) {
  const cards = document.querySelectorAll(".product-card");
  const p = PRODUCTS.find((p) => p.id === Number(id));
  if (!p) return;

  /* Encuentra la card por posición (mismo orden que PRODUCTS) */
  const index = PRODUCTS.indexOf(p);
  const card = cards[index];
  if (!card) return;

  const actionsEl = card.querySelector(".product-actions");
  const qty = cart[id] || 0;

  actionsEl.innerHTML =
    qty === 0
      ? `<button class="add-btn" data-action="add" data-id="${id}">+ Agregar</button>`
      : `<div class="qty-controls">
           <button class="qty-btn qty-minus" data-action="decrease" data-id="${id}" aria-label="Restar">−</button>
           <span class="qty-value">${qty}</span>
           <button class="qty-btn qty-plus"  data-action="increase" data-id="${id}" aria-label="Sumar">+</button>
         </div>`;
}

/* ══════════════════════════════════════════
   ABRIR / CERRAR CARRITO
══════════════════════════════════════════ */
function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════════
   WHATSAPP
══════════════════════════════════════════ */
function buildMessage() {
  const items = getCartItems();
  if (items.length === 0) return null;

  const lines = [
    "🔥 *PEDIDO - LA BROCHETA* 🔥",
    "",
    "📦 *Productos:*",
  ];

  for (const { product: p, qty } of items) {
    lines.push(`• ${p.name} ×${qty} — ${formatPrice(p.price * qty)}`);
  }

  lines.push("");
  lines.push(`💰 *Total: ${formatPrice(getCartTotal())}*`);
  lines.push("");
  lines.push("_Packs de 5 unidades c/u. ¡Muchas gracias! 🙌_");

  return lines.join("\n");
}

function sendWhatsApp() {
  const msg = buildMessage();
  if (!msg) {
    showToast("Tu carrito está vacío");
    return;
  }
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener");
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  /* Forzar reflow para reiniciar la transición */
  void toast.offsetWidth;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ══════════════════════════════════════════
   DESPACHO DE ACCIONES (delegación de eventos)
══════════════════════════════════════════ */
function handleAction(action, id) {
  const numId = Number(id);
  if (action === "add")      addItem(numId);
  if (action === "increase") increaseItem(numId);
  if (action === "decrease") decreaseItem(numId);
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  /* Render inicial */
  renderProducts();
  renderCart();
  updateUI();

  /* Delegación: grilla de productos */
  document.getElementById("productsGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (btn) handleAction(btn.dataset.action, btn.dataset.id);
  });

  /* Delegación: items del carrito */
  document.getElementById("cartItemsList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (btn) handleAction(btn.dataset.action, btn.dataset.id);
  });

  /* Abrir carrito */
  document.getElementById("headerCartBtn").addEventListener("click", openCart);
  document.getElementById("stickyBtn").addEventListener("click", openCart);

  /* Cerrar carrito */
  document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  /* WhatsApp */
  document.getElementById("whatsappBtn").addEventListener("click", sendWhatsApp);

  /* Vaciar carrito */
  document.getElementById("clearCartBtn").addEventListener("click", () => {
    if (confirm("¿Querés vaciar el carrito?")) clearCart();
  });

  /* ESC para cerrar */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
});
