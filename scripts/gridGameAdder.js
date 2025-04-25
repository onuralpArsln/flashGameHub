fetch('scripts/games.json')
  .then(res => res.json()) // JSON'a çeviriyoruz
  .then(games => {
    const gridUpper = document.getElementById('gamesUpper');
    const gridLower = document.getElementById('gamesLower');

    let isMaleFiltered = false; // Erkek filtre durumu
    let isFemaleFiltered = false; // Kadın filtre durumu

    // Cinsiyete göre oyunları filtrele
    function filterGamesByGender(gender) {
      // İlk başta gridleri temizle
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';

      const filteredGames = games.filter(game => game.cinsiyet === gender);

      filteredGames.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'gameCard';
        card.innerHTML = `
          <a href="gamePage.html?id=${game.id}">
            <img src="${game.image}" alt="${game.name}" class="gameCardImg" />
            <p>${game.name}</p>
          </a>
        `;

        if (index < 20) {
          gridUpper.appendChild(card);
        } else {
          gridLower.appendChild(card);
        }
      });
    }

    // Tüm oyunları yeniden göster
    function showAllGames() {
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';

      games.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'gameCard';
        card.innerHTML = `
          <a href="gamePage.html?id=${game.id}">
            <img src="${game.image}" alt="${game.name}" class="gameCardImg" />
            <p>${game.name}</p>
          </a>
        `;

        if (index < 20) {
          gridUpper.appendChild(card);
        } else {
          gridLower.appendChild(card);
        }
      });
    }

    // Erkek oyunlarını göster ya da filtreyi kaldır
    document.getElementById('maleButton').addEventListener('click', () => {
      // Eğer erkek filtre aktifse, geri al
      if (isMaleFiltered) {
        showAllGames(); // Filtreyi kaldır
        isMaleFiltered = false;
        document.getElementById('maleButton').classList.remove('active'); // 'active' sınıfını kaldır
      } else {
        filterGamesByGender('erkek'); // Erkekleri göster
        isMaleFiltered = true;
        document.getElementById('maleButton').classList.add('active'); // 'active' sınıfını ekle

        // Kadın filtreyi kaldır
        isFemaleFiltered = false;
        document.getElementById('femaleButton').classList.remove('active');
      }
    });

    // Kadın oyunlarını göster ya da filtreyi kaldır
    document.getElementById('femaleButton').addEventListener('click', () => {
      // Eğer kadın filtre aktifse, geri al
      if (isFemaleFiltered) {
        showAllGames(); // Filtreyi kaldır
        isFemaleFiltered = false;
        document.getElementById('femaleButton').classList.remove('active'); // 'active' sınıfını kaldır
      } else {
        filterGamesByGender('kadın'); // Kadınları göster
        isFemaleFiltered = true;
        document.getElementById('femaleButton').classList.add('active'); // 'active' sınıfını ekle

        // Erkek filtreyi kaldır
        isMaleFiltered = false;
        document.getElementById('maleButton').classList.remove('active');
      }
    });

    // Başlangıçta tüm oyunları göster
    showAllGames();
  });
