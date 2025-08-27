document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    // PART 1: MOCK BACKEND & STATE MANAGEMENT
    // Simulates your database and user session data.
    // =================================================================================

    // IMPORTANT: Create a 'music' folder and place your mp3 files there.
    // Then, update the `url` properties below to match your filenames.
    const gb = document.getElementById("get-recommend-btn");
    document.getElementById("hub-mood-select").selectedIndex=5;

    const mockSongDatabase = {
        'song-01': { id: 'song-01', title: 'Gamma Pulse', url: 'music/song1.mp3', tags: ['gamma', 'electronic', 'focus'] },
        'song-02': { id: 'song-02', title: 'Logic Flow', url: 'music/song2.mp3', tags: ['gamma', 'ambient', 'focus', 'problem-solving'] },
        'song-03': { id: 'song-03', title: 'Cavalleria Rusticana', url: 'music/song3.mp3', tags: ['alpha', 'lo-fi', 'calm', 'creative'] },
        'song-04': { id: 'song-04', title: 'Swan Lake', url: 'music/song4.mp3', tags: ['alpha', 'lo-fi', 'calm', 'study'] }
    };

    const mockAlbumDatabase = {
        'album-01': { id: 'album-01', title: 'Deep Gamma: Code Structure', songIds: ['song-01', 'song-02'], tags: ['gamma', 'focus', 'electronic'] },
        'album-02': { id: 'album-02', title: 'Calm Coder: Classical Music', songIds: ['song-03', 'song-04'], tags: ['alpha', 'calm', 'lo-fi'] }
    };

    // Global state for the application
    const appState = {
        currentUser: {
            preferences: {
                likedTags: new Set(),
                dislikedTags: new Set(),
            }
        },
        currentSession: {
            album: null,
            playlist: [],
            currentTrackIndex: 0,
            isPlaying: false,
            isLooping: false,
            timerId: null,
            secondsRemaining: 0,
        },
        currentMood: 'neutral',
    };

    const savePreferencesToLocalStorage = () => {
                const preferences = {
                    likedTags: Array.from(appState.currentUser.preferences.likedTags),
                    dislikedTags: Array.from(appState.currentUser.preferences.dislikedTags)
                };
                localStorage.setItem('userMusicPreferences', JSON.stringify(preferences));
                console.log("Preferences saved to localStorage:", preferences);
            };

            // Load preferences from localStorage
            const loadPreferencesFromLocalStorage = () => {
                const savedPreferences = localStorage.getItem('userMusicPreferences');
                if (savedPreferences) {
                    try {
                        const preferences = JSON.parse(savedPreferences);
                        appState.currentUser.preferences.likedTags = new Set(preferences.likedTags || []);
                        appState.currentUser.preferences.dislikedTags = new Set(preferences.dislikedTags || []);
                        console.log("Preferences loaded from localStorage:", preferences);
                        
                        // Update the UI to show loaded preferences
                        // updatePreferencesUI();
                    } catch (e) {
                        console.error("Error parsing saved preferences:", e);
                    }
                }
            };

    // =================================================================================
    // PART 2: PLUGGABLE API STUBS / SERVICE LAYER
    // These functions simulate API calls. Replace their contents with your real backend calls.
    // =================================================================================

    const api = {
        /**
         * TOY RECOMMENDER SYSTEM
         * @param {string} mood - The user's selected mood (e.g., 'focused').
         * @param {object} userPrefs - The user's liked/disliked tags.
         * @returns {Promise<Array>} A promise that resolves with a sorted list of recommended albums.
         */
        getAlbumRecommendations: async (mood, userPrefs) => {
            console.log(`Fetching recommendations for mood: ${mood}`);
            // --- START of Pluggable Section: Recommender ---
            // TODO: Replace this entire function body with a real API call to your recommendation LLM.
            // The API should return a list of album objects.

            const moodToTags = {
                'focused': ['focus', 'gamma'],
                'creative': ['creative', 'alpha', 'theta'],
                'problem-solving': ['problem-solving', 'beta', 'gamma'],
                'overwhelmed': ['calm', 'alpha'],
                'tired': ['calm', 'lo-fi'],
                'neutral': [],
            };

            const targetTags = new Set(moodToTags[mood] || []);
            const allAlbums = Object.values(mockAlbumDatabase);

            const scoredAlbums = allAlbums.map(album => {
                let score = 0;
                const albumTags = new Set(album.tags);

                // Score based on mood match
                for (const tag of targetTags) {
                    if (albumTags.has(tag)) score += 5;
                }

                // Score based on user preferences
                for (const tag of userPrefs.likedTags) {
                    if (albumTags.has(tag)) score += 10; // Higher weight for liked tags
                }
                for (const tag of userPrefs.dislikedTags) {
                    if (albumTags.has(tag)) score -= 15; // Strong penalty for disliked tags
                }
                
                return { ...album, score };
            });
            console.log(scoredAlbums);
            scoredAlbums.sort((a, b) => b.score - a.score);
            
            return new Promise(resolve => {
                setTimeout(() => resolve(scoredAlbums), 100); // Simulate network delay
            });
            // --- END of Pluggable Section: Recommender ---
        },

        /**
         * AI SONG GENERATOR
         * @param {string} prompt - The user's text prompt.
         * @returns {Promise<object>} A promise that resolves with a mock generated song object.
         */
        generateSongWithAI: async (prompt) => {
            console.log(`Generating song for prompt: "${prompt}"`);
            // --- START of Pluggable Section: Song Generator ---
            // TODO: Replace this with your actual generative AI API call.
            // The API should return a song object with a URL to the generated audio.
            
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        id: `ai-${Date.now()}`,
                        title: `AI: ${prompt.substring(0, 20)}...`,
                        url: 'music/song1.mp3', // Use a placeholder track for the prototype
                        tags: ['ai-generated', 'ambient'],
                    });
                }, 2500); // Simulate AI generation time
            });
            // --- END of Pluggable Section: Song Generator ---
        },

        /**
         * BRAINWAVE MODULATOR
         * @param {HTMLAudioElement} audio - The audio element to apply modulation to.
         */
        applyBrainwaveModulation: (audio) => {
            // --- START of Pluggable Section: Modulator ---
            // TODO: This is the entry point for your core scientific function.
            // Integrate your audio processing library (e.g., using Web Audio API) here.
            // You can create an AudioContext, connect the audio element as a source,
            // and apply your custom filters, oscillators, or other modulation effects.
            
            console.log("Applying brainwave modulation to audio source (placeholder).");
            // Example using Web Audio API (if you were to implement it):
            // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            // const source = audioCtx.createMediaElementSource(audio);
            // const biquadFilter = audioCtx.createBiquadFilter();
            // ... connect nodes and set parameters ...
            // source.connect(biquadFilter).connect(audioCtx.destination);
            // --- END of Pluggable Section: Modulator ---
        }
    };

    // =================================================================================
    // PART 3: CORE FUNCTIONALITY (Player, Timer, UI Rendering)
    // =================================================================================

    const audioPlayer = document.getElementById('audio-player');
    const playerElements = {
        title: document.getElementById('player-track-title'),
        album: document.getElementById('player-album-title'),
        timer: document.getElementById('player-timer'),
        progressBar: document.getElementById('player-progress-bar-inner'),
        playPauseBtn: document.getElementById('player-play-pause-btn'),
        loopBtn: document.getElementById('player-loop-btn'),
    };

    // --- Audio Player Logic ---
    const playCurrentTrack = () => {
        const track = appState.currentSession.playlist[appState.currentSession.currentTrackIndex];
        if (!track) return;

        playerElements.title.textContent = track.title;
        playerElements.album.textContent = appState.currentSession.album.title;
        audioPlayer.src = track.url;
        audioPlayer.play();
        api.applyBrainwaveModulation(audioPlayer); // Apply modulator
        appState.currentSession.isPlaying = true;
        playerElements.playPauseBtn.innerHTML = '⏸️';
    };

    const pauseTrack = () => {
        audioPlayer.pause();
        appState.currentSession.isPlaying = false;
        playerElements.playPauseBtn.innerHTML = '▶️';
    };

    const playNextTrack = () => {
        appState.currentSession.currentTrackIndex++;
        if (appState.currentSession.currentTrackIndex >= appState.currentSession.playlist.length) {
            if (appState.currentSession.isLooping) {
                appState.currentSession.currentTrackIndex = 0; // Loop playlist
            } else {
                // End of playlist, could stop or handle differently
                pauseTrack();
                return;
            }
        }
        playCurrentTrack();
    };

    const playPrevTrack = () => {
        appState.currentSession.currentTrackIndex--;
        if (appState.currentSession.currentTrackIndex < 0) {
            appState.currentSession.currentTrackIndex = appState.currentSession.playlist.length - 1;
        }
        playCurrentTrack();
    };

    // --- Session Timer Logic ---
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const startSessionTimer = (durationMinutes) => {
        stopSessionTimer(); // Clear any existing timer
        appState.currentSession.secondsRemaining = durationMinutes * 60;
        playerElements.timer.textContent = formatTime(appState.currentSession.secondsRemaining);

        appState.currentSession.timerId = setInterval(() => {
            appState.currentSession.secondsRemaining--;
            playerElements.timer.textContent = formatTime(appState.currentSession.secondsRemaining);

            if (appState.currentSession.secondsRemaining <= 0) {
                console.log("Session complete!");
                stopSessionTimer();
                pauseTrack();
                alert("Focus Session Complete!");
                navigateTo('page-hub');
            }
        }, 1000);
    };

    const stopSessionTimer = () => {
        if (appState.currentSession.timerId) {
            clearInterval(appState.currentSession.timerId);
            appState.currentSession.timerId = null;
        }
    };

    // --- UI Rendering ---
    const renderAlbums = (albums) => {
        const grid = document.getElementById('album-grid');
        grid.innerHTML = ''; // Clear previous results
        albums.forEach(album => {
            const card = document.createElement('div');
            card.className = 'album-card';
            card.innerHTML = `
                <div class="album-art-placeholder"></div>
                <div class="album-info">
                    <h3 class="album-title">${album.title}</h3>
                    <div class="album-tags">
                        ${album.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <p>Contains ${album.songIds.length} tracks.</p>
                    <div class="album-actions">
                        <button class="btn btn-secondary btn-small">Preview</button>
                        <button class="btn btn-primary btn-small select-album-btn" data-album-id="${album.id}">Select</button>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    };

    // =================================================================================
    // PART 4: EVENT LISTENERS & APP INITIALIZATION
    // =================================================================================

    // --- Navigation ---
    const pages = document.querySelectorAll('.page');
    const navigateTo = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId)?.classList.add('active');
    };
    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.target));
    });

    // --- Initial Mood Check-in ---
    document.getElementById('find-sound-btn').addEventListener('click', async () => {
        const selectedMood = document.querySelector('.mood-option.selected')?.dataset.mood || 'neutral';
        appState.currentMood = selectedMood;
        document.getElementById("hub-mood-select").value=selectedMood;
        const recommendations = await api.getAlbumRecommendations(appState.currentMood, appState.currentUser.preferences);
        renderAlbums(recommendations);
        navigateTo('page-album-recommendations');
    });
    document.querySelectorAll('.mood-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // --- Album Selection ---
    document.getElementById('album-grid').addEventListener('click', (e) => {
        if (e.target.classList.contains('select-album-btn')) {
            const albumId = e.target.dataset.albumId;
            appState.currentSession.album = mockAlbumDatabase[albumId];
            document.getElementById('selected-album-title').textContent = appState.currentSession.album.title;
            navigateTo('page-session-creator');
        }
    });

    // --- Start Session ---
    document.getElementById('start-session-btn').addEventListener('click', () => {
        if (!appState.currentSession.album) {
            alert("Please select an album first.");
            return;
        }
        // Build playlist
        appState.currentSession.playlist = appState.currentSession.album.songIds.map(id => mockSongDatabase[id]);
        appState.currentSession.currentTrackIndex = 0;
        
        // Start timer
        const duration = parseInt(document.getElementById('session-duration').value, 10);
        startSessionTimer(duration);

        // Start player
        playCurrentTrack();
        navigateTo('page-player');
    });
    
    // --- Player Controls ---
    function plpa(){
        if (appState.currentSession.isPlaying) {
            pauseTrack();
        } else {
            audioPlayer.play();
            appState.currentSession.isPlaying = true;
            playerElements.playPauseBtn.innerHTML = '⏸️';
        }
    };
    document.getElementById('player-next-btn').addEventListener('click', playNextTrack);
    document.getElementById('player-prev-btn').addEventListener('click', playPrevTrack);
    playerElements.loopBtn.addEventListener('click', () => {
        appState.currentSession.isLooping = !appState.currentSession.isLooping;
        playerElements.loopBtn.classList.toggle('active', appState.currentSession.isLooping);
    });
    document.getElementById('end-session-btn').addEventListener('click', () => {
        stopSessionTimer();
        pauseTrack();
        navigateTo('page-hub');
    });

    // --- Player Feedback (for Toy Recommender) ---
    const handleFeedback = (isLike) => {
        const track = appState.currentSession.playlist[appState.currentSession.currentTrackIndex];
        if (!track) return;
        track.tags.forEach(tag => {
            if (isLike) {
                appState.currentUser.preferences.likedTags.add(tag);
                appState.currentUser.preferences.dislikedTags.delete(tag);
            } else {
                appState.currentUser.preferences.dislikedTags.add(tag); 
                appState.currentUser.preferences.likedTags.delete(tag);
            }
        });
        savePreferencesToLocalStorage();
        console.log("Updated User Preferences:", appState.currentUser.preferences);
        alert(`Feedback recorded! Your future recommendations will be adjusted.`);
    };
    document.getElementById('player-like-btn').addEventListener('click', () => handleFeedback(true));
    document.getElementById('player-dislike-btn').addEventListener('click', () => handleFeedback(false));

    // --- Audio Player Event Listeners ---
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        playerElements.progressBar.style.width = `${progress}%`;
    });
    audioPlayer.addEventListener('ended', playNextTrack);

    // --- AI Song Generator Button ---
    document.getElementById('generate-ai-song-btn').addEventListener('click', async () => {
        const prompt = document.getElementById('ai-prompt-input').value;
        if (!prompt) {
            alert("Please enter a prompt.");
            return;
        }
        alert("Generating AI track... this might take a moment.");
        const generatedSong = await api.generateSongWithAI(prompt);
        // In a real app, you'd add this to a preview player. For now, we'll just log it.
        console.log("AI Song Generated:", generatedSong);
        alert(`Generated song: "${generatedSong.title}". Check the console for details.`);
    });

    // --- App Initialization ---
    const initApp = () => {
        loadPreferencesFromLocalStorage();
        setTimeout(() => {
            navigateTo('page-mood-check-in');
        }, 1500);
    };

    initApp();
    playerElements.playPauseBtn.addEventListener("click",plpa);
    gb.addEventListener("click",async () => {
        console.log(document.getElementById("hub-mood-select").value);
        appState.currentMood=document.getElementById("hub-mood-select").value;
        const recommendations = await api.getAlbumRecommendations(appState.currentMood, appState.currentUser.preferences);
        renderAlbums(recommendations);
    });
});