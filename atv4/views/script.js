async function getWeather() {
    const city = document.getElementById("city").value.trim();
    const resultDiv = document.getElementById("result");

    if (!city) {
        resultDiv.innerHTML = "<p class=\"error\">Digite o nome de uma cidade.</p>";
        return;
    }

    try {
        const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }

        const temp = Number(data.temperature);
        const feels = Number(data.feels_like);
        const tempText = Number.isNaN(temp) ? data.temperature : temp.toFixed(1);
        const feelsText = Number.isNaN(feels) ? data.feels_like : feels.toFixed(1);

        resultDiv.innerHTML = `
            <div class="weather">
                <h2>${data.city}, ${data.country}</h2>
                <div class="weather__body">
                    <img class="weather__icon" src="${data.icon}" alt="" width="80" height="80" />
                    <p class="weather__temp">${tempText}°C</p>
                </div>
                <ul class="weather__meta">
                    <li><strong>Sensação</strong> ${feelsText}°C</li>
                    <li><strong>Umidade</strong> ${data.humidity}%</li>
                </ul>
                <p class="weather__desc">${data.description}</p>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = "<p class=\"error\">Erro ao buscar os dados. Tente novamente.</p>";
    }
}
