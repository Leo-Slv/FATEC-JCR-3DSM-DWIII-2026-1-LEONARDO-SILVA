const form = document.querySelector("#item-form");
const inputName = document.querySelector("#item-name");
const statusEl = document.querySelector("#status");

if (!form || !inputName) {
  throw new Error("Elementos #item-form e/ou #item-name não encontrados no DOM.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = String(inputName.value ?? "").trim();
  if (!name) {
    if (statusEl) statusEl.textContent = "Informe o nome do item.";
    return;
  }

  try {
    const response = await fetch("/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof data === "object" && data && "message" in data
          ? String(data.message)
          : `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    inputName.value = "";
    if (statusEl) statusEl.textContent = "Item cadastrado com sucesso.";
    console.log("Criado:", data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido.";
    if (statusEl) statusEl.textContent = message;
    console.error(err);
  }
});

