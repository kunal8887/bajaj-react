import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const filterOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' },
];

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState([]);

    const handleSubmit = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);
            if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
                throw new Error('Invalid format');
            }
            const res = await axios.post('https://bajaj-finserv-liart.vercel.app/bfhl', parsedInput);
            setResponse(res.data);
            setError('');
        } catch (err) {
            setError('Invalid JSON input. Ensure the format is: {"data": ["item1", "item2", ...]}');
        }
    };

    const handleFilterChange = (selectedOptions) => {
        setFilters(selectedOptions.map(option => option.value));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="relative w-full max-w-lg mb-4">
                <textarea
                    id="jsonInput"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="1"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    onFocus={() => document.getElementById('jsonInputLabel').classList.add('focused')}
                    onBlur={() => {
                        if (!jsonInput) {
                            document.getElementById('jsonInputLabel').classList.remove('focused');
                        }
                    }}
                    placeholder=' '
                />
                <label
                    id="jsonInputLabel"
                    className={`absolute left-2 top-2 text-gray-500 transition-all transform ${
                        jsonInput ? 'focused' : ''
                    }`}
                    htmlFor="jsonInput"
                >
                    API Input
                </label>
            </div>
            <button
                className="w-full max-w-lg bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSubmit}
            >
                Submit
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {response && (
                <div className="mt-4 w-full max-w-lg">
                    <h2 className="text-xl font-bold mb-2">Multi Filter</h2>
                    <Select
                        isMulti
                        options={filterOptions}
                        className="w-full mb-4"
                        classNamePrefix="react-select"
                        onChange={handleFilterChange}
                    />
                    <div className="bg-white p-4 border border-gray-300 rounded">
                        <h3 className="font-bold mb-2">Filtered Response</h3>
                        {filters.includes('alphabets') && (
                            <p className="mb-2">
                                <span className="font-bold">Alphabets:</span> {response.alphabets.join(',')}
                            </p>
                        )}
                        {filters.includes('numbers') && (
                            <p className="mb-2">
                                <span className="font-bold">Numbers:</span> {response.numbers.join(',')}
                            </p>
                        )}
                        {filters.includes('highest_alphabet') && (
                            <p className="mb-2">
                                <span className="font-bold">Highest Alphabet:</span> {response.highest_alphabet.join(',')}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
