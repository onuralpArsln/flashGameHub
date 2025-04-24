fetch('games.json')
    .then(res => res.json())
    .then(games => {
        const grid = document.getElementById('game-grid');

        games.forEach(game => {
            const card = document.createElement('div');
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
