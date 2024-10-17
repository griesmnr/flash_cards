import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file

function App() {
    const [collections, setCollections] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState('');

    // Fisher-Yates Shuffle Algorithm for randomizing the cards
    const shuffleArray = (array) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Use require.context to dynamically import all JSON files in the 'data' folder
    useEffect(() => {
        const context = require.context('./data', false, /\.json$/);
        const files = context.keys().map((file) => file.replace('./', ''));
        setCollections(files);
        if (files.length > 0) {
            setSelectedCollection(files[0]); // Default to the first collection
        }
    }, []);

    // Load the selected collection when it changes
    useEffect(() => {
        if (selectedCollection) {
            const fetchData = async () => {
                try {
                    const data = await import(`./data/${selectedCollection}`);
                    const shuffledCards = shuffleArray(data.default);
                    setFlashcards(shuffledCards);
                } catch (error) {
                    console.error('Error loading flashcards:', error);
                }
            };
            fetchData();
        }
    }, [selectedCollection]);

    const handleNext = () => {
        setShowBack(false);
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
    };

    const handleFlip = () => {
        setShowBack((prev) => !prev);
    };

    const handleCollectionChange = (event) => {
        setSelectedCollection(event.target.value);
        setCurrentCard(0); // Reset to the first card
        setShowBack(false); // Ensure front is shown
    };

    return (
        <div className="App">
            <div className="collection-selector">
                <label>Select Collection: </label>
                <select onChange={handleCollectionChange} value={selectedCollection}>
                    {collections.map((file, index) => (
                        <option key={index} value={file}>
                            {file.replace('.json', '')}
                        </option>
                    ))}
                </select>
            </div>

            {flashcards.length > 0 && (
                <div className="card">
                    <h1>{flashcards[currentCard].front}</h1>
                    {showBack && (
                        <div>
                            <h2>{flashcards[currentCard].back.name}</h2>
                            <p>Sounds Like: {flashcards[currentCard].back.soundsLike}</p>
                            <p>Example Usage: {flashcards[currentCard].back.exampleUsage}</p>
                        </div>
                    )}
                    <button onClick={handleFlip}>
                        {showBack ? 'Show Front' : 'Show Back'}
                    </button>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
        </div>
    );
}

export default App;
