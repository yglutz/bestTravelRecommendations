document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resetBtn = document.getElementById('resetBtn');
    const body = document.querySelector('body');


    let recommendations = null;

    fetch('travel_recommendations_api.json')
      .then(response => response.json())
      .then(data => {
          recommendations = data
          console.log('Recommendations loaded:', recommendations);
      })
      .catch(error => {
        console.error('Error:', error);
      });


    function searchRecommendations(query) {
        if (!recommendations || !query) {
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        const results = [];

        // Check if search term is related to beaches category
        const isBeachRelated = searchTerm.includes('beach') ||
            'beach'.includes(searchTerm) ||
            'beaches'.includes(searchTerm);

        // Check if search term is related to temples category
        const isTempleRelated = searchTerm.includes('temple') ||
            'temple'.includes(searchTerm) ||
            'temples'.includes(searchTerm);

        // Check if search term is related to cities
        const isCityRelated = searchTerm.includes('city') ||
            'city'.includes(searchTerm) ||
            'cities'.includes(searchTerm);

        recommendations.countries.forEach(country => {
            if (country.name.toLowerCase().includes(searchTerm.trim())) {
                results.push({
                    type: 'country',
                    item: country
                });
            }

            country.cities.forEach(city => {
                if (
                    city.name.toLowerCase().includes(searchTerm) ||
                    city.description.toLowerCase().includes(searchTerm) ||
                    isCityRelated
                ) {
                    results.push({
                        type: 'city',
                        item: city
                    });
                }
            });
        });

        recommendations.temples.forEach(temple => {
            if (
                temple.name.toLowerCase().includes(searchTerm) ||
                temple.description.toLowerCase().includes(searchTerm) ||
                isTempleRelated
            ) {
                results.push({
                    type: 'temple',
                    item: temple
                });
            }
        });

        recommendations.beaches.forEach(beach => {
            if (
                beach.name.toLowerCase().includes(searchTerm) ||
                beach.description.toLowerCase().includes(searchTerm) ||
                isBeachRelated
            ) {
                results.push({
                    type: 'beach',
                    item: beach
                });
            }
        });

        displayResults(results);

    }

    function displayResults(results) {
        const existingResults = document.querySelector('.results');
        if (existingResults) {
            existingResults.remove();
        }
        const resultsContainer = document.createElement('div');
        resultsContainer.classList.add('search-results');
        body.appendChild(resultsContainer);

        if (results.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = 'No results found.';
            noResults.className = 'noResults';
            resultsContainer.appendChild(noResults);
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div')
                resultItem.classList.add('results');

                // img
                const image = document.createElement('img');
                image.src = result.item.imageUrl;
                image.alt = result.item.name;

                resultItem.appendChild(image);

                // div
                const contentDiv = document.createElement('div');
                contentDiv.className = 'result-content';

                // type badge
                const type = document.createElement('span');
                type.className = 'result-type';
                type.textContent = result.type.charAt(0).toUpperCase() + result.type.slice(1).toLowerCase();
                contentDiv.appendChild(type);

                //title
                const title = document.createElement('h3');
                title.textContent = result.item.name;
                contentDiv.appendChild(title);

                // description
                const description = document.createElement('p');
                description.textContent = result.item.description;
                contentDiv.appendChild(description);

                // add content div to result item
                resultItem.appendChild(contentDiv);

                // append result item to results container
                resultsContainer.appendChild(resultItem);
            })
        }

        console.log('Displaying results:', results);
    }

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log(searchInput.value);
        searchRecommendations(searchInput.value);
        console.log('Searching for: ' + searchInput.value);
    });

    resetBtn.addEventListener('click', function() {
        searchInput.value = '';
        // Implement result clearing logic here
        alert('Results cleared.');
    });
});
