fetch('scripts/games.json')
  .then(res => res.json())
  .then(games => {
    const gridUpper = document.getElementById('gamesUpper');
    const gridLower = document.getElementById('gamesLower');
    const gridSame = document.getElementById('gamesSame');

    let isMaleFiltered = false;
    let isFemaleFiltered = false;
    let currentCategory = null;
    let searchQuery = '';

    function clearGrids() {
      if (gridUpper) gridUpper.innerHTML = '';
      if (gridLower) gridLower.innerHTML = '';
      if (gridSame) gridSame.innerHTML = '';
    }

    function clearSearch() {
      searchQuery = '';
      const searchInput = document.querySelector('input[name="aranan"]');
      if (searchInput) searchInput.value = '';
    }

    function renderGames(gamesToRender) {
      clearGrids();

      if (gamesToRender.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.width = '100%';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '20px';
        noResults.style.fontSize = '18px';
        noResults.innerHTML = 'Oyun bulunamadı. Lütfen başka bir arama terimi deneyin.';
        
        if (gridUpper) gridUpper.appendChild(noResults);
        else if (gridSame) gridSame.appendChild(noResults);

        return;
      }

      let gameCount = 0;
      const gameCardWidth = 220;
      const gridWidth = gridUpper?.offsetWidth || gridSame?.offsetWidth || 1200;
      const cardsPerRow = Math.floor(gridWidth / gameCardWidth);

      gamesToRender.forEach((game) => {
        const card = document.createElement('div');
        card.className = 'gameCard';
        if (game.cinsiyet) {
          const genderClass = game.cinsiyet.includes('erkek') ? 'male' : 'female';
          card.classList.add(genderClass);
        }
        card.innerHTML = `
          <a href="gamePage.html?id=${game.id}">
            <img src="${game.image}" alt="${game.title}" class="gameCardImg" />
            <p>${game.title}</p>
          </a>
        `;

        if (gridUpper && gameCount < cardsPerRow * 3) {
          gridUpper.appendChild(card);
        } else if (gridLower && gridUpper && gameCount >= cardsPerRow * 3) {
          gridLower.appendChild(card);
        } else if (gridSame) {
          gridSame.appendChild(card);
        }

        gameCount++;
      });
    }

    function filterGamesByGender(gender) {
      clearGrids();
      clearSearch();
      const filteredGames = games.filter(game => {
        if (!game.cinsiyet) return false;
        const genders = game.cinsiyet.toLowerCase().split(',').map(g => g.trim());
        if (currentCategory && !game.genres?.toLowerCase().includes(currentCategory.toLowerCase())) return false;
        return genders.includes(gender);
      });
      renderGames(filteredGames);
    }

    function filterGamesByCategory(category) {
      clearGrids();
      clearSearch();
      currentCategory = category;
      const filteredGames = games.filter(game => game.genres?.toLowerCase().includes(category.toLowerCase()));
      renderGames(filteredGames);
    }

    function searchGames(query) {
      clearGrids();
      searchQuery = query.toLowerCase();
      const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 0);

      const scoredGames = games.map(game => {
        const title = game.title.toLowerCase();
        let score = 0;

        if (title === searchQuery) score += 100;
        if (title.startsWith(searchQuery)) score += 75;
        if (title.includes(searchQuery)) score += 50;

        searchTerms.forEach(term => {
          if (title.includes(term)) {
            score += 25;
            const words = title.split(/\s+/);
            for (const word of words) {
              if (word.startsWith(term)) score += 15;
            }
          }
        });

        let charMatches = 0;
        for (let i = 0; i < searchQuery.length; i++) {
          if (title.includes(searchQuery[i])) {
            charMatches++;
          }
        }
        score += (charMatches / searchQuery.length) * 10;

        return { game, score };
      });

      const filteredGames = scoredGames
        .filter(({ game, score }) => {
          if (score < 10) return false;
          if (isMaleFiltered && (!game.cinsiyet || !game.cinsiyet.toLowerCase().includes('erkek'))) return false;
          if (isFemaleFiltered && (!game.cinsiyet || !game.cinsiyet.toLowerCase().includes('kız'))) return false;
          if (currentCategory && !game.genres?.toLowerCase().includes(currentCategory.toLowerCase())) return false;
          return true;
        })
        .sort((a, b) => b.score - a.score)
        .map(({ game }) => game);

      renderGames(filteredGames);
    }

    function showAllGames() {
      clearGrids();
      currentCategory = null;
      clearSearch();
      renderGames(games);
    }

    document.getElementById('maleButton')?.addEventListener('click', () => {
      if (isMaleFiltered) {
        isMaleFiltered = false;
        document.getElementById('maleButton').classList.remove('active');
        currentCategory ? filterGamesByCategory(currentCategory) : showAllGames();
      } else {
        isMaleFiltered = true;
        isFemaleFiltered = false;
        document.getElementById('maleButton').classList.add('active');
        document.getElementById('femaleButton').classList.remove('active');
        filterGamesByGender('erkek');
      }
    });

    document.getElementById('femaleButton')?.addEventListener('click', () => {
      if (isFemaleFiltered) {
        isFemaleFiltered = false;
        document.getElementById('femaleButton').classList.remove('active');
        currentCategory ? filterGamesByCategory(currentCategory) : showAllGames();
      } else {
        isFemaleFiltered = true;
        isMaleFiltered = false;
        document.getElementById('femaleButton').classList.add('active');
        document.getElementById('maleButton').classList.remove('active');
        filterGamesByGender('kız');
      }
    });

    document.querySelectorAll('.kategori-link').forEach(link => {
      link.addEventListener('click', function (event) {
        // URL zaten değişiyor, müdahale etmiyoruz
      });
    });

    const searchForm = document.querySelector('.ara');
    searchForm?.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchInput = this.querySelector('input[name="aranan"]');
      if (searchInput) searchGames(searchInput.value);
    });

    const searchInput = document.querySelector('input[name="aranan"]');
    searchInput?.addEventListener('keyup', function (event) {
      if (this.value.length >= 2) {
        searchGames(this.value);
      } else if (this.value.length === 0) {
        if (isMaleFiltered) {
          filterGamesByGender('erkek');
        } else if (isFemaleFiltered) {
          filterGamesByGender('kız');
        } else if (currentCategory) {
          filterGamesByCategory(currentCategory);
        } else {
          showAllGames();
        }
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    const category = urlParams.get('kategori');
    const search = urlParams.get('aranan');

    if (search) {
      searchGames(search);
      const searchInput = document.querySelector('input[name="aranan"]');
      if (searchInput) searchInput.value = search;
    } else if (filter === 'erkek') {
      isMaleFiltered = true;
      document.getElementById('maleButton')?.classList.add('active');
      filterGamesByGender('erkek');
    } else if (filter === 'kiz') {
      isFemaleFiltered = true;
      document.getElementById('femaleButton')?.classList.add('active');
      filterGamesByGender('kız');
    } else if (category) {
      filterGamesByCategory(category);
    } else {
      showAllGames();
    }

  });

// Türkçe tarih formatı
const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
const today = new Date();
const formattedDate = today.toLocaleDateString('tr-TR', options);
document.getElementById('currentDate')?.textContent = formattedDate;
