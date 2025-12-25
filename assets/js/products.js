const client = window.supabaseClient;

window.openProduct = id => {
  window.location.href = `product.html?id=${id}`;
};

document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("products");
  container.innerHTML = "";

  const grouped = {};

  // GROUP PRODUCTS BY CATEGORY
  data.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  // RENDER EACH CATEGORY
  Object.keys(grouped).forEach(category => {
    container.innerHTML += `
      <h2 class="category-title">${category}</h2>

      <div class="swiper productSwiper">
        <div class="swiper-wrapper">
          ${grouped[category].map(p => `
            <div class="swiper-slide">
              <div class="product-card" onclick="openProduct('${p.id}')">
                
                <div class="product-image">
                  <img src="${p.cover_image}" alt="${p.name}">
                  <span class="price-tag">₹${p.price}</span>
                </div>

                <h4 class="product-title">${p.name}</h4>

              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });

  // 🔥 INIT SWIPER AFTER HTML IS READY
  document.querySelectorAll(".productSwiper").forEach(swiper => {
    new Swiper(swiper, {
      slidesPerView: 1.3,
      spaceBetween: 16,
      breakpoints: {
        768: { slidesPerView: 3 }
      }
    });
  });
});
