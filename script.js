document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('header-search');
    const searchBtn = document.getElementById('header-search-btn');
    const tabs = document.querySelectorAll('.tab-btn');
    const resultsArea = document.getElementById('results-area');

    let currentCategory = 'all';
    let currentQuery = '';

    // Mock Data Generator
    function generateMockData(category, query) {
        const safeQuery = query || "example";
        
        if (category === 'flights') {
            return [
                { type: 'flight', title: `Flight to ${safeQuery}`, airline: "SkyHigh Airways", price: "$340", time: "2h 15m", from: "NYC", to: safeQuery },
                { type: 'flight', title: `Direct Flight to ${safeQuery}`, airline: "Oceanic Air", price: "$420", time: "2h 30m", from: "NYC", to: safeQuery },
                { type: 'flight', title: `Budget Flight: ${safeQuery}`, airline: "LowCost Jet", price: "$199", time: "3h 45m", from: "NYC", to: safeQuery },
            ];
        } else if (category === 'hotels') {
            return [
                { type: 'hotel', title: `Grand Hotel ${safeQuery}`, rating: "4.8 ★", price: "$250/night", location: `Downtown ${safeQuery}`, image: "https://placehold.co/200x150/orange/white?text=Hotel" },
                { type: 'hotel', title: `${safeQuery} City Inn`, rating: "4.2 ★", price: "$120/night", location: `Near Station, ${safeQuery}`, image: "https://placehold.co/200x150/blue/white?text=Inn" },
                { type: 'hotel', title: `Luxury Suites ${safeQuery}`, rating: "5.0 ★", price: "$550/night", location: `Waterfront, ${safeQuery}`, image: "https://placehold.co/200x150/green/white?text=Suites" },
            ];
        } else if (category === 'holidays') {
            return [
                { type: 'holiday', title: `Package to ${safeQuery}: 5 Days`, agency: "TravelCo", price: "$899", details: "Flight + Hotel included" },
                { type: 'holiday', title: `${safeQuery} Adventure Tour`, agency: "ExploreMore", price: "$1,200", details: "Guided tour, meals included" },
            ];
        } else if (category === 'cars') {
            return [
                { type: 'car', title: `Economy Car in ${safeQuery}`, company: "RentFast", price: "$45/day", carModel: "Toyota Corolla or similar" },
                { type: 'car', title: `SUV Rental ${safeQuery}`, company: "DriveAway", price: "$85/day", carModel: "Ford Explorer or similar" },
            ];
        } else {
            // General Web Results
            return [
                { type: 'web', title: `${safeQuery} - Official Guide`, url: `https://www.${safeQuery.replace(/\s/g,'')}.com`, snippet: `Welcome to the official page for ${safeQuery}. Find all the information you need here.` },
                { type: 'web', title: `Top 10 Things to Know About ${safeQuery}`, url: `https://blog.example.com/${safeQuery.replace(/\s/g,'-')}`, snippet: `Discover the secrets of ${safeQuery} in our comprehensive guide updated for 2023.` },
                { type: 'web', title: `${safeQuery} News and Updates`, url: `https://news.example.com/${safeQuery.replace(/\s/g,'-')}`, snippet: `Latest breaking news and updates regarding ${safeQuery} from around the globe.` },
                { type: 'web', title: `Images of ${safeQuery}`, url: `https://images.example.com/${safeQuery.replace(/\s/g,'-')}`, snippet: `Browse thousands of high quality images of ${safeQuery}.` },
            ];
        }
    }

    // Render Functions
    function renderResults(data) {
        resultsArea.innerHTML = '';
        
        if (data.length === 0) {
            resultsArea.innerHTML = '<div class="welcome-message"><p>No results found.</p></div>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            
            if (item.type === 'flight') {
                card.className = 'result-card flight-card';
                card.innerHTML = `
                    <div class="card-details">
                        <div class="meta-info">${item.airline}</div>
                        <h3 class="result-title">${item.title}</h3>
                        <div class="meta-info">${item.from} ➝ ${item.to} • ${item.time}</div>
                        <div class="price-tag">${item.price}</div>
                    </div>
                `;
            } else if (item.type === 'hotel' || item.type === 'holiday') {
                card.className = 'result-card hotel-card';
                const img = item.image || 'https://placehold.co/200x150/gray/white?text=Trip';
                card.innerHTML = `
                    <img src="${img}" alt="${item.title}" class="card-image">
                    <div class="card-details">
                        <div class="meta-info">${item.rating || item.agency}</div>
                        <h3 class="result-title">${item.title}</h3>
                        <div class="meta-info">${item.location || item.details}</div>
                        <div class="price-tag">${item.price}</div>
                    </div>
                `;
            } else if (item.type === 'car') {
                card.className = 'result-card';
                card.innerHTML = `
                    <div class="card-details">
                        <div class="meta-info">${item.company}</div>
                        <h3 class="result-title">${item.title}</h3>
                        <div class="meta-info">${item.carModel}</div>
                        <div class="price-tag">${item.price}</div>
                    </div>
                `;
            } else {
                // Web result
                card.className = 'result-card';
                card.innerHTML = `
                    <a href="#" class="result-title">${item.title}</a>
                    <span class="result-url">${item.url}</span>
                    <p class="result-snippet">${item.snippet}</p>
                `;
            }
            resultsArea.appendChild(card);
        });
    }

    // Search Handler
    function handleSearch() {
        currentQuery = searchInput.value.trim();
        if (!currentQuery) return;
        
        // Simulate loading
        resultsArea.innerHTML = '<div class="welcome-message">Searching...</div>';
        
        setTimeout(() => {
            const data = generateMockData(currentCategory, currentQuery);
            renderResults(data);
        }, 300);
    }

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update category
            currentCategory = tab.dataset.category;
            
            // Re-run search if there is a query
            if (searchInput.value.trim()) {
                handleSearch();
            }
        });
    });

    // Login Button Placeholder
    document.querySelector('.btn-login').addEventListener('click', () => {
        alert('Login functionality would connect to your secure authentication provider here.');
    });
});
