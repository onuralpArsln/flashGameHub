fetch('scripts/games.json')
  .then(res => res.json())
  .then(data => {
    const games = data;

    // Function to create game cards
    function createGameCard(game) {
      const card = document.createElement('div');
      card.className = 'gameCard';

      if (game.gender) {
        const genderClass = game.gender.includes('erkek') ? 'male' : 'female';
        card.classList.add(genderClass);
      }

      const isSWF = game.src && (game.src.includes('Swf') || game.src.includes('.swf'));
      let swfFileName = '';
      if (isSWF) {
        const swfMatch = game.src.match(/([^\/\\]+\.swf)/i);
        if (swfMatch) swfFileName = swfMatch[1];
      }

      const gameLink = isSWF
        ? `Swf-Ruffle-Test-Page.html?game=${encodeURIComponent(swfFileName)}`
        : `gamePage.html?id=${game.id}`;

      card.innerHTML = `
        <a href="${gameLink}" style="display: flex; flex-direction: column; height: 100%;">
          <img src="${game.image.replace(/\\/g, '/')}" alt="${game.title}" class="gameCardImg" />
          <p style="margin: 10px 0; text-align: center; flex-grow: 1;">${game.title}</p>
        </a>
      `;
      return card;
    }

    // Function to display random games with valid titles
    function displayRandomGames() {
      const container = document.getElementById('gamesSame');
      if (!container) return;

      // Clear previous content
      container.innerHTML = '';

      // Filter games with valid titles (at least 2 characters)
      const filteredGames = games.filter(
        game => typeof game.title === 'string' && game.title.trim().length >= 2
      );

      // Shuffle and get first 5
      const shuffled = [...filteredGames].sort(() => 0.5 - Math.random());
      const selectedGames = shuffled.slice(0, 5);

      // Create and append cards
      selectedGames.forEach(game => {
        const card = createGameCard(game);
        container.appendChild(card);
      });
    }

    // Call function after data is loaded
    displayRandomGames();
  })
  .catch(error => console.error('Error loading games:', error));
