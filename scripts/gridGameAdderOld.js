fetch('scripts/games.json')
  .then(res => res.json()) // fetchin resultunu jsona çevirdik
  .then(games => {  // gelen resultu games olarak aldık 
    const gridUpper = document.getElementById('gamesUpper'); // üst gridi aldık
    const gridLower = document.getElementById('gamesLower'); // alt gridi aldık

    games.forEach((game, index) => {
      const card = document.createElement('div'); // oyuna ait cardlar oluşturuldu oyun görselleri buraya eklencek
      card.className = 'gameCard';
      card.innerHTML = `
        <a href="gamePage.html?id=${game.id}">
          <img src="${game.image}" alt="${game.name}" class="gameCardImg" />
          <p>${game.name}</p>
        </a>
      `;

      // İlk 20 oyunu gamesUpper'a, geri kalanları gamesLower'a ekle
      if (index < 20) {
        gridUpper.appendChild(card);
      } else {
        gridLower.appendChild(card);
      }
    });
  });