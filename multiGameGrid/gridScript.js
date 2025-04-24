fetch('games.json')
  .then(res => res.json()) // fetchin resultunu jsona çevirdik
  .then(games => {  // gelen resultu games olarak aldık 
    const grid = document.getElementById('game-grid'); // bağlı olduğu dokümandan game-gridi aldık

    games.forEach(game => {
      const card = document.createElement('div'); // oyuna ait cardlar oluşturuldu oyun görselleri buraya eklencek
      card.className = 'game-card';
      card.innerHTML = `
        <a href="gamePage.html?id=${game.id}">
          <img src="${game.image}" alt="${game.name}" />
          <p>${game.name}</p>
        </a>
      `;
      grid.appendChild(card);
    });
  });
