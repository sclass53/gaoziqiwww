document.addEventListener('DOMContentLoaded', () => {
    
    // --- CORE NAVIGATION LOGIC ---
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('[data-target]');

    const navigateTo = (pageId) => {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        // Show the target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        } else {
            console.error(`Page with ID "${pageId}" not found.`);
        }
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            navigateTo(targetId);
        });
    });

    // --- INITIAL APP LAUNCH SEQUENCE ---
    const initApp = () => {
        // 1. Show Splash Screen for a short duration
        setTimeout(() => {
            // 2. Navigate to the one-time mood check-in
            navigateTo('page-mood-check-in');
            // In a real app, you'd check if the user has done this before.
            // For this prototype, it always shows.
        }, 2000); // 2-second splash
    };

    // --- FEATURE-SPECIFIC LOGIC ---

    // S2: Album Recommendation -> S3: Session Creator Data Simulation
    const selectAlbumButtons = document.querySelectorAll('.select-album-btn');
    const selectedAlbumTitleEl = document.getElementById('selected-album-title');

    selectAlbumButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Find the album title from the card that was clicked
            const albumCard = e.target.closest('.album-card');
            const albumTitle = albumCard.querySelector('.album-title').textContent;
            
            // Update the title in the session creator page
            if (selectedAlbumTitleEl) {
                selectedAlbumTitleEl.textContent = albumTitle;
            }
            
            // The navigation is already handled by the data-target attribute
        });
    });

    // S5: Song Generator Hub Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update button active state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update content active state
            const targetTabId = button.dataset.tab;
            tabContents.forEach(content => {
                if (content.id === targetTabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
    
    // S3: Workflow Picker
    const workflowOptions = document.querySelectorAll('.workflow-option');
    workflowOptions.forEach(option => {
        option.addEventListener('click', () => {
            workflowOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            // In a real app, this would update a state variable
        });
    });

    // S4: Player Feedback Buttons
    const feedbackButtons = document.querySelectorAll('.feedback-btn');
    feedbackButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active'); // Simple visual feedback
            // In a real app, send this feedback to the backend ML model
            console.log(`Feedback recorded: ${button.title}`);
        });
    });
    
    // S7: Theme Selector
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const theme = option.dataset.theme;
            // In a real app, you would change the CSS variables or body class
            console.log(`Theme changed to: ${theme}`);
        });
    });


    // --- START THE APP ---
    initApp();

});