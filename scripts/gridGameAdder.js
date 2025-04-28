// URL'den oyun ID'sini al
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

// Oyun verilerini yükle
fetch('scripts/games.json')
  .then(response => response.json())
  .then(oyunlar => {
    // Oyunu ID'ye göre bul
    const oyun = oyunlar.find(o => o.id == gameId);

    const iframeContainer = document.getElementById("gameIframeContainer");

    if (oyun) {
      if (oyun.swfFile) {
        // SWF dosyası varsa Ruffle üzerinden yükle
        iframeContainer.innerHTML = `
          <iframe 
            src="Swf-Ruffle-Test-Page.html?swf=${encodeURIComponent(oyun.swfFile)}" 
            width="960" 
            height="600" 
            frameborder="0"
            allowfullscreen
          ></iframe>
        `;
      } else if (oyun.src) {
        // SWF dosyası yoksa src içeriğini kullan
        iframeContainer.innerHTML = oyun.src;
      } else {
        // Ne swfFile ne src varsa hata mesajı göster
        iframeContainer.innerHTML = `
          <div style="text-align: center; padding: 50px;">
            <h2>Oyun bulunamadı!</h2>
            <p>Lütfen başka bir oyun seçin.</p>
          </div>
        `;
      }
    } else {
      // ID eşleşmedi ise hata mesajı
      iframeContainer.innerHTML = `
        <div style="text-align: center; padding: 50px;">
          <h2>Oyun bulunamadı!</h2>
          <p>Lütfen başka bir oyun seçin.</p>
        </div>
      `;
    }
  })
  .catch(error => {
    console.error("Hata:", error);
    document.getElementById("gameIframeContainer").innerHTML = `
      <div style="color: red; text-align: center;">
        Oyun yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
      </div>
    `;
  });
