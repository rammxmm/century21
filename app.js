document.addEventListener('DOMContentLoaded', () => {
    // HOME PAGE ELEMENTS
    const propertiesContainer = document.getElementById('properties-container');
    const aiModalTrigger = document.getElementById('trigger-ai-modal');
    const featuredSection = document.querySelector('.featured-section');
    
    // NEW SECTIONS
    const allPropertiesSection = document.getElementById('all-properties-section');
    const fullPropertiesGrid = document.getElementById('full-properties-grid');
    const propertiesSectionTitle = document.getElementById('properties-section-title');
    const btnBackFeatured = document.getElementById('btn-back-featured');

    // BUTTONS
    const btnBuy = document.getElementById('btn-buy');
    const btnRent = document.getElementById('btn-rent');
    const btnExplore = document.getElementById('btn-explore');
    const navBuy = document.getElementById('nav-buy');
    const navRent = document.getElementById('nav-rent');
    const navExplore = document.getElementById('nav-explore');

    // DETAILS MODAL ELEMENTS
    const detailsModal = document.getElementById('property-details-modal');
    const closeDetailsModal = document.getElementById('close-details-modal');
    const detailImage = document.getElementById('detail-image');
    const detailStatus = document.getElementById('detail-status');
    const detailType = document.getElementById('detail-type');
    const detailTitle = document.getElementById('detail-title');
    const detailLocation = document.getElementById('detail-location');
    const detailPrice = document.getElementById('detail-price');
    const detailBeds = document.getElementById('detail-beds');
    const detailBaths = document.getElementById('detail-baths');
    const detailArea = document.getElementById('detail-area');
    const detailDesc = document.getElementById('detail-desc');
    const detailTags = document.getElementById('detail-tags');

    // AI MODAL ELEMENTS
    const aiModal = document.getElementById('ai-modal');
    const closeAiModalBtn = document.getElementById('close-ai-modal');
    const aiSearchInput = document.getElementById('semantic-search');
    const aiSearchBtn = document.getElementById('btn-search-ai');
    const aiResultsContainer = document.getElementById('ai-results-container');
    
    let allProperties = [];

    // Cargar propiedades
    async function loadProperties() {
        try {
            const response = await fetch('properties.json');
            allProperties = await response.json();
            renderFeaturedCollection(allProperties);
        } catch (error) {
            console.error("Error loading properties:", error);
        }
    }

    // Renderizar la colección destacada (1 Grande, 2 Pequeñas)
    function renderFeaturedCollection(properties) {
        if (!propertiesContainer) return;
        propertiesContainer.innerHTML = '';
        if (properties.length < 3) return;

        const featured = properties[0];
        const small1 = properties[1];
        const small2 = properties[2];

        propertiesContainer.innerHTML = `
            <div class="property-card-large" data-id="${featured.id}">
                <div class="card-img-large">
                    <div class="badge-black">JUST LISTED</div>
                    <img src="${featured.image}" alt="${featured.title}">
                </div>
                <div class="card-info-large">
                    <div class="card-price-row">
                        <h3>${featured.price}</h3>
                        <svg class="heart-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </div>
                    <p>${featured.title}, ${featured.location}</p>
                    <div class="card-amenities">
                        <span>🛏 ${featured.bedrooms} BEDS</span>
                        <span>🚿 ${featured.bathrooms} BATHS</span>
                        <span>📐 ${featured.area} SQFT</span>
                    </div>
                </div>
            </div>
            
            <div class="small-cards-wrapper">
                <div class="property-card-small" data-id="${small1.id}">
                    <div class="card-img-small">
                        <div class="badge-gold">FEATURED</div>
                        <img src="${small1.image}" alt="${small1.title}">
                    </div>
                    <div class="card-info-small">
                        <h4>${small1.price}</h4>
                        <p>${small1.title}</p>
                        <div class="card-amenities-small">
                            <span>${small1.bedrooms} BEDS</span> • <span>${small1.bathrooms} BATHS</span>
                        </div>
                    </div>
                </div>
                
                <div class="property-card-small" data-id="${small2.id}">
                    <div class="card-img-small">
                        <img src="${small2.image}" alt="${small2.title}">
                    </div>
                    <div class="card-info-small">
                        <h4>${small2.price}</h4>
                        <p>${small2.title}</p>
                        <div class="card-amenities-small">
                            <span>${small2.bedrooms} BEDS</span> • <span>${small2.bathrooms} BATHS</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        attachCardListeners();
    }

    // ==========================================
    // BUY / RENT SECTIONS LOGIC
    // ==========================================

    function showSection(type) {
        if (!allPropertiesSection) return;
        
        // Update Active Button States
        [btnBuy, btnRent, btnExplore].forEach(btn => btn?.classList.remove('active'));
        
        featuredSection.style.display = 'none';
        allPropertiesSection.classList.remove('hidden');

        let filteredProperties = [];

        if (type === 'buy') {
            btnBuy?.classList.add('active');
            propertiesSectionTitle.textContent = "PROPERTIES FOR SALE";
            filteredProperties = allProperties.filter(p => p.status === 'buy');
        } else if (type === 'rent') {
            btnRent?.classList.add('active');
            propertiesSectionTitle.textContent = "PROPERTIES FOR RENT";
            filteredProperties = allProperties.filter(p => p.status === 'rent');
        } else {
            // Explore shows all
            btnExplore?.classList.add('active');
            propertiesSectionTitle.textContent = "ALL PROPERTIES";
            filteredProperties = allProperties;
        }

        renderFullProperties(filteredProperties);
    }

    function renderFullProperties(properties) {
        fullPropertiesGrid.innerHTML = '';
        
        properties.forEach(prop => {
            fullPropertiesGrid.innerHTML += `
                <div class="property-card-small" data-id="${prop.id}" style="cursor: pointer;">
                    <div class="card-img-small">
                        <div class="badge-${prop.status === 'buy' ? 'gold' : 'black'}">${prop.status === 'buy' ? 'FOR SALE' : 'FOR RENT'}</div>
                        <img src="${prop.image}" alt="${prop.title}">
                    </div>
                    <div class="card-info-small">
                        <h4>${prop.price}</h4>
                        <p>${prop.title}</p>
                        <div class="card-amenities-small">
                            <span>${prop.bedrooms} BEDS</span> • <span>${prop.bathrooms} BATHS</span>
                        </div>
                    </div>
                </div>
            `;
        });

        attachCardListeners();
    }

    function showFeaturedSection() {
        allPropertiesSection.classList.add('hidden');
        featuredSection.style.display = 'block';
        [btnBuy, btnRent, btnExplore].forEach(btn => btn?.classList.remove('active'));
        btnBuy?.classList.add('active'); // Default
    }

    // Event Listeners for Filters
    btnBuy?.addEventListener('click', () => showSection('buy'));
    btnRent?.addEventListener('click', () => showSection('rent'));
    btnExplore?.addEventListener('click', () => showSection('explore'));
    navBuy?.addEventListener('click', (e) => { e.preventDefault(); showSection('buy'); });
    navRent?.addEventListener('click', (e) => { e.preventDefault(); showSection('rent'); });
    navExplore?.addEventListener('click', (e) => { e.preventDefault(); showSection('explore'); });
    btnBackFeatured?.addEventListener('click', showFeaturedSection);

    // ==========================================
    // DETAILS MODAL LOGIC
    // ==========================================

    function attachCardListeners() {
        const cards = document.querySelectorAll('.property-card-large, .property-card-small, .match-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.getAttribute('data-id'));
                if (id) openDetailsModal(id);
            });
        });
    }

    function openDetailsModal(id) {
        const prop = allProperties.find(p => p.id === id);
        if (!prop) return;

        detailImage.src = prop.image;
        detailStatus.textContent = prop.status === 'buy' ? 'FOR SALE' : 'FOR RENT';
        detailStatus.className = prop.status === 'buy' ? 'badge-gold' : 'badge-black';
        detailType.textContent = prop.type.toUpperCase();
        detailTitle.textContent = prop.title;
        detailLocation.textContent = prop.location;
        detailPrice.textContent = prop.price;
        detailBeds.textContent = prop.bedrooms;
        detailBaths.textContent = prop.bathrooms;
        detailArea.textContent = prop.area;
        detailDesc.textContent = prop.description;
        
        detailTags.innerHTML = prop.tags.map(tag => `<span>${tag}</span>`).join('');

        detailsModal.classList.remove('hidden');
    }

    closeDetailsModal?.addEventListener('click', () => {
        detailsModal.classList.add('hidden');
    });

    // ==========================================
    // AI MODAL LOGIC
    // ==========================================
    
    if (aiModalTrigger && aiModal) {
        aiModalTrigger.addEventListener('click', () => {
            aiModal.classList.remove('hidden');
            setTimeout(() => aiSearchInput.focus(), 100);
            aiResultsContainer.innerHTML = `
                <div style="padding: 2rem; color: #666; grid-column: span 2;">
                    Write a prompt to see AI semantic matches...
                </div>
            `;
        });

        closeAiModalBtn.addEventListener('click', () => {
            aiModal.classList.add('hidden');
        });
    }

    function performAISearch(query) {
        if (!query.trim()) return;

        const normalizedQuery = query.toLowerCase();
        
        const results = allProperties.map(prop => {
            let matchScore = 50;
            const searchSpace = `${prop.title} ${prop.description} ${prop.tags.join(' ')} ${prop.location}`.toLowerCase();
            
            const words = normalizedQuery.split(' ');
            words.forEach(word => {
                if (word.length > 3 && searchSpace.includes(word)) {
                    matchScore += 15;
                }
            });

            matchScore = Math.min(99, matchScore + Math.floor(Math.random() * 10));

            return { ...prop, matchPercent: matchScore };
        }).sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 2);

        renderAIResults(results);
    }

    function renderAIResults(results) {
        aiResultsContainer.innerHTML = '';
        
        results.forEach(prop => {
            aiResultsContainer.innerHTML += `
                <div class="match-card" data-id="${prop.id}">
                    <img src="${prop.image}" alt="${prop.title}" class="match-img">
                    <div class="match-info">
                        <h5>${prop.matchPercent}% MATCH</h5>
                        <h4>${prop.title}</h4>
                        <p>${prop.tags.slice(0,2).join(', ')}</p>
                    </div>
                </div>
            `;
        });
        
        attachCardListeners(); // Ensure AI matches can also open details
    }

    if (aiSearchBtn) {
        aiSearchBtn.addEventListener('click', () => performAISearch(aiSearchInput.value));
        aiSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performAISearch(aiSearchInput.value);
        });
    }

    // Init
    loadProperties();
});
