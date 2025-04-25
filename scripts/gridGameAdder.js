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

      let gameCount = 0; // Eklenen oyun sayısını tutan sayaç
      const gameCardWidth = 220; // gameCard genişliğini belirleyin (örnek olarak 220px)
      const gridWidth = gridUpper.offsetWidth; // gamesUpper'ın genişliği
      const cardsPerRow = Math.floor(gridWidth / gameCardWidth); // Satır başına kaç kart olacak

      filteredGames.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'gameCard';
        const genderClass = gender === 'erkek' ? 'male' : 'female';
        card.classList.add(genderClass);
        card.innerHTML = `
          <a href="gamePage.html?id=${game.id}">
            <img src="${game.image}" alt="${game.name}" class="gameCardImg" />
            <p>${game.name}</p>
          </a>
        `;

        // Satır başına kaç kart varsa, ona göre upper ve lower'a yerleştir
        if (gameCount < cardsPerRow * 3) {  // İlk 3 satır
          gridUpper.appendChild(card);
        } else {
          gridLower.appendChild(card);
        }

        gameCount++;
      });
    }

    // Tüm oyunları yeniden göster
    function showAllGames() {
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';

      let gameCount = 0; // Eklenen oyun sayısını tutan sayaç
      const gameCardWidth = 220; // gameCard genişliğini belirleyin (örnek olarak 220px)
      const gridWidth = gridUpper.offsetWidth; // gamesUpper'ın genişliği
      const cardsPerRow = Math.floor(gridWidth / gameCardWidth); // Satır başına kaç kart olacak

      games.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'gameCard';
        const genderClass = game.cinsiyet === 'erkek' ? 'male' : 'female';
        card.classList.add(genderClass); // Cinsiyet sınıfını ekliyoruz
        card.innerHTML = `
          <a href="gamePage.html?id=${game.id}">
            <img src="${game.image}" alt="${game.name}" class="gameCardImg" />
            <p>${game.name}</p>
          </a>
        `;

        // Satır başına kaç kart varsa, ona göre upper ve lower'a yerleştir
        if (gameCount < cardsPerRow * 3) {  // İlk 3 satır
          gridUpper.appendChild(card);
        } else {
          gridLower.appendChild(card);
        }

        gameCount++;
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
