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

      // Split search query into terms (words)
      const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 0);

      // Score each game based on how well it matches the search query
      const scoredGames = games.map(game => {
        const title = game.title.toLowerCase();
        let score = 0;

        // Exact match gets highest score
        if (title === searchQuery) {
          score += 100;
        }

        // Starts with query gets high score
        if (title.startsWith(searchQuery)) {
          score += 75;
        }

        // Contains full query gets medium score
        if (title.includes(searchQuery)) {
          score += 50;
        }

        // For each search term, add points if title contains it
        searchTerms.forEach(term => {
          if (title.includes(term)) {
            score += 25;

            // Bonus points for words that start with the term
            const words = title.split(/\s+/);
            for (const word of words) {
              if (word.startsWith(term)) {
                score += 15;
              }
            }
          }
        });

        // Character-by-character matching (for typos and similar words)
        let charMatches = 0;
        for (let i = 0; i < searchQuery.length; i++) {
          if (title.includes(searchQuery[i])) {
            charMatches++;
          }
        }
        score += (charMatches / searchQuery.length) * 10;

        return { game, score };
      });

      // Filter games based on minimum score threshold and other filters
      const filteredGames = scoredGames
        .filter(({ game, score }) => {
          // Minimum match score to be included (adjust as needed)
          if (score < 10) return false;

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
        })
        .sort((a, b) => b.score - a.score) // Sort by score in descending order
        .map(({ game }) => game); // Extract just the game objects

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

      if (gamesToRender.length === 0) {
        // No games found - display a message
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.width = '100%';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '20px';
        noResults.style.fontSize = '18px';
        noResults.innerHTML = 'Oyun bulunamadı. Lütfen başka bir arama terimi deneyin.';
        gridUpper.appendChild(noResults);
        return;
      }

      gamesToRender.forEach((game) => {
        const card = document.createElement('div');
        card.className = 'gameCard';
        if (game.cinsiyet) {
          const genderClass = game.cinsiyet.includes('erkek') ? 'male' : 'female';
          card.classList.add(genderClass);
        }
        card.innerHTML = `
          <a href="Game-Page-İ-Frame.html?id=${game.id}">
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

    // Add keyup event for real-time search (optional)
    const searchInput = document.querySelector('input[name="aranan"]');
    if (searchInput) {
      searchInput.addEventListener('keyup', function (event) {
        // Only trigger search if the user has entered at least 2 characters
        if (this.value.length >= 2) {
          searchGames(this.value);
        } else if (this.value.length === 0) {
          // If search field is cleared, reset to default view
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
    }

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

    // Türkçe tarih formatı (25 Nisan 2025 Cuma)
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      weekday: 'long' 
    };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('tr-TR', options);
    
    // Tarih yazılacak elementi seç ve güncelle
    document.getElementById('currentDate').textContent = formattedDate;
    // URL'den oyun ID'sini al
