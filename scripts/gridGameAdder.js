fetch('scripts/games.json')
  .then(res => res.json())
  .then(games => {
    const gridUpper = document.getElementById('gamesUpper');
    const gridLower = document.getElementById('gamesLower');

    let isMaleFiltered = false;
    let isFemaleFiltered = false;

    function filterGamesByGender(gender) {
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';

      const filteredGames = games.filter(game => {
        if (!game.cinsiyet) return false;
        const genders = game.cinsiyet.toLowerCase().split(',').map(g => g.trim());
        return genders.includes(gender);
      });

      let gameCount = 0;
      const gameCardWidth = 220;
      const gridWidth = gridUpper.offsetWidth;
      const cardsPerRow = Math.floor(gridWidth / gameCardWidth);

      filteredGames.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'gameCard';
        const genderClass = gender === 'erkek' ? 'male' : 'female';
        card.classList.add(genderClass);
        card.innerHTML = `
          <a href="gamePage.html?id=${game.id}">
            <img src="${game.image}" alt="${game.title}" class="gameCardImg" />
            <p>${game.title}</p>
          </a>
        `;

        if (gameCount < cardsPerRow * 3) {
          gridUpper.appendChild(card);
        } else {
          gridLower.appendChild(card);
        }

        gameCount++;
      });
    }

    function showAllGames() {
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';

      let gameCount = 0;
      const gameCardWidth = 220;
      const gridWidth = gridUpper.offsetWidth;
      const cardsPerRow = Math.floor(gridWidth / gameCardWidth);

      games.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'gameCard';
        const genderClass = game.cinsiyet === 'erkek' ? 'male' : 'female';
        card.classList.add(genderClass);
        card.innerHTML = `
          <a href="gamePage.html?id=${game.id}">
            <img src="${game.image}" alt="${game.title}" class="gameCardImg" />
            <p>${game.title}</p>
          </a>
        `;

        if (gameCount < cardsPerRow * 3) {
          gridUpper.appendChild(card);
        } else {
          gridLower.appendChild(card);
        }

        gameCount++;
      });
    }

    document.getElementById('maleButton').addEventListener('click', () => {
      if (isMaleFiltered) {
        showAllGames();
        isMaleFiltered = false;
        document.getElementById('maleButton').classList.remove('active');
      } else {
        filterGamesByGender('erkek');
        isMaleFiltered = true;
        document.getElementById('maleButton').classList.add('active');

        isFemaleFiltered = false;
        document.getElementById('femaleButton').classList.remove('active');
      }
    });

    document.getElementById('femaleButton').addEventListener('click', () => {
      if (isFemaleFiltered) {
        showAllGames();
        isFemaleFiltered = false;
        document.getElementById('femaleButton').classList.remove('active');
      } else {
        filterGamesByGender('kız');
        isFemaleFiltered = true;
        document.getElementById('femaleButton').classList.add('active');

        isMaleFiltered = false;
        document.getElementById('maleButton').classList.remove('active');
      }
    });

    // URL'den otomatik filtre oku
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');

    if (filter === 'erkek') {
      filterGamesByGender('erkek');
      isMaleFiltered = true;
      document.getElementById('maleButton').classList.add('active');
    } else if (filter === 'kiz') {
      filterGamesByGender('kız');
      isFemaleFiltered = true;
      document.getElementById('femaleButton').classList.add('active');
    } else {
      showAllGames();
    }
  });
