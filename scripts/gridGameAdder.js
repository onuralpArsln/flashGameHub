fetch('scripts/games.json')
  .then(res => res.json())
  .then(games => {
    const gridUpper = document.getElementById('gamesUpper');
    const gridLower = document.getElementById('gamesLower');

    let isMaleFiltered = false;
    let isFemaleFiltered = false;
    let currentCategory = null;
    let searchQuery = '';

    function filterGamesByGender(gender) {
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';

      // Clear search when gender filter is applied
      clearSearch();

      const filteredGames = games.filter(game => {
        if (!game.cinsiyet) return false;
        const genders = game.cinsiyet.toLowerCase().split(',').map(g => g.trim());

        // Apply category filter if there's an active category
        if (currentCategory && !game.genres?.toLowerCase().includes(currentCategory.toLowerCase())) {
          return false;
        }

        return genders.includes(gender);
      });

      renderGames(filteredGames);
    }

    function filterGamesByCategory(category) {
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';

      currentCategory = category;

      // Clear search when category filter is applied
      clearSearch();

      const filteredGames = games.filter(game => {
        // Check for category match
        const categoryMatch = game.genres?.toLowerCase().includes(category.toLowerCase());
        if (!categoryMatch) return false;

        // Apply gender filter if active
        if (isMaleFiltered && (!game.cinsiyet || !game.cinsiyet.toLowerCase().includes('erkek'))) {
          return false;
        }
        if (isFemaleFiltered && (!game.cinsiyet || !game.cinsiyet.toLowerCase().includes('kız'))) {
          return false;
        }

        return true;
      });

      renderGames(filteredGames);
    }

    function searchGames(query) {
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';

      searchQuery = query.trim().toLowerCase();

      if (!searchQuery) {
        // If search is cleared, reapply other filters or show all games
        if (isMaleFiltered) {
          filterGamesByGender('erkek');
        } else if (isFemaleFiltered) {
          filterGamesByGender('kız');
        } else if (currentCategory) {
          filterGamesByCategory(currentCategory);
        } else {
          showAllGames();
        }
        return;
      }

      const filteredGames = games.filter(game => {
        // Check for title match
        const titleMatch = game.title.toLowerCase().includes(searchQuery);
        if (!titleMatch) return false;

        // Apply gender filter if active
        if (isMaleFiltered && (!game.cinsiyet || !game.cinsiyet.toLowerCase().includes('erkek'))) {
          return false;
        }
        if (isFemaleFiltered && (!game.cinsiyet || !game.cinsiyet.toLowerCase().includes('kız'))) {
          return false;
        }

        // Apply category filter if active
        if (currentCategory && !game.genres?.toLowerCase().includes(currentCategory.toLowerCase())) {
          return false;
        }

        return true;
      });

      renderGames(filteredGames);
    }

    function clearSearch() {
      // Clear the search query
      searchQuery = '';

      // Clear the search input field
      const searchInput = document.querySelector('input[name="aranan"]');
      if (searchInput) {
        searchInput.value = '';
      }
    }

    function showAllGames() {
      gridUpper.innerHTML = '';
      gridLower.innerHTML = '';
      currentCategory = null;
      clearSearch();

      renderGames(games);
    }

    function renderGames(gamesToRender) {
      let gameCount = 0;
      const gameCardWidth = 220;
      const gridWidth = gridUpper.offsetWidth || 1200; // fallback
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
        isMaleFiltered = false;
        document.getElementById('maleButton').classList.remove('active');

        // Re-apply category filter if active or show all games
        if (currentCategory) {
          filterGamesByCategory(currentCategory);
        } else {
          showAllGames();
        }
      } else {
        isMaleFiltered = true;
        document.getElementById('maleButton').classList.add('active');
        isFemaleFiltered = false;
        document.getElementById('femaleButton').classList.remove('active');

        filterGamesByGender('erkek');
      }
    });

    document.getElementById('femaleButton').addEventListener('click', () => {
      if (isFemaleFiltered) {
        isFemaleFiltered = false;
        document.getElementById('femaleButton').classList.remove('active');

        // Re-apply category filter if active or show all games
        if (currentCategory) {
          filterGamesByCategory(currentCategory);
        } else {
          showAllGames();
        }
      } else {
        isFemaleFiltered = true;
        document.getElementById('femaleButton').classList.add('active');
        isMaleFiltered = false;
        document.getElementById('maleButton').classList.remove('active');

        filterGamesByGender('kız');
      }
    });

    // Add click event listeners to category links
    document.querySelectorAll('.kategori-link').forEach(link => {
      link.addEventListener('click', function (event) {
        // We don't prevent default here because we want the URL to update
        // The category filter will be applied when the page loads with the new URL
      });
    });

    // Set up search form functionality
    const searchForm = document.querySelector('.ara');
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the form from submitting to another page
      const searchInput = this.querySelector('input[name="aranan"]');
      searchGames(searchInput.value);
    });

    // URL'den filtre veya kategori oku
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    const category = urlParams.get('kategori');
    const search = urlParams.get('aranan');

    if (search) {
      // If there's a search term in the URL, use it and update the search input
      searchQuery = search.toLowerCase();
      const searchInput = document.querySelector('input[name="aranan"]');
      if (searchInput) {
        searchInput.value = search;
      }
      searchGames(search);
    } else if (filter === 'erkek') {
      filterGamesByGender('erkek');
      isMaleFiltered = true;
      document.getElementById('maleButton').classList.add('active');
    } else if (filter === 'kiz') {
      filterGamesByGender('kız');
      isFemaleFiltered = true;
      document.getElementById('femaleButton').classList.add('active');
    } else if (category) {
      filterGamesByCategory(category);
    } else {
      showAllGames();
    }
  });