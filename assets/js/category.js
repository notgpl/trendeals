const client = window.supabaseClient;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("name");

  if (!category) return;

  document.getElementById("categoryTitle").textContent = category;

  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("products");
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div class="product-card" onclick="location.href='product.html?id=${p.id}'">

        <div class="product-image">
          <img src="${p.cover_image}">
          <span class="price-tag">₹${p.price}</span>
        </div>

        <h4 class="product-title">${p.name}</h4>

      </div>
    `;
  });
});
