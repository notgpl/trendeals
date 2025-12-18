document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/products.json")
    .then(res => res.json())
    .then(data => {
      const section = document.getElementById("products");
      if (!section) return;

      data.categories.forEach(cat => {
        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
          <h2 style="margin-top:20px;">${cat.title}</h2>

          <div class="swiper productSwiper">
            <div class="swiper-wrapper">
              ${cat.products.map(p => `
                <div class="swiper-slide product-card"
                  onclick="openProduct(this)"
                  data-name="${p.name}"
                  data-price="${p.price}"
                  data-images="${p.images.join(",")}"
                  data-sizes="${(p.sizes || []).join(",")}"
                  data-colors="${(p.colors || []).join(",")}">

                  <div class="price-tag">₹${p.price}</div>

                  <div class="product-image">
                    <img src="${p.images[0]}" alt="">

                    <div class="availability-box">
                      <span class="status">
                        ${p.available ? "Available" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <h4>${p.name}</h4>
                </div>
              `).join("")}
            </div>
          </div>
        `;

        section.appendChild(wrapper);
      });

      // Init Swiper AFTER DOM is ready
      new Swiper(".productSwiper", {
        slidesPerView: 1.3,
        spaceBetween: 15,
        breakpoints: {
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }
      });
    })
    .catch(err => console.error("Product load error:", err));
});
