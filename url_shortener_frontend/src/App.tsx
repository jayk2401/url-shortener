import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios'; // or use fetch

import logo from './logo.svg';
import './App.css';
import DataTable from './DataTable';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('')
  const [urlData, setUrlData] = useState([])


  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  useEffect(() => {

    const getUrlData = async () => {

      try {
        const response = await axios.get('http://localhost:8080/api/url_data'); // change to your API URL
        console.log(response)
        setUrlData(response.data.data.urlData)

      } catch (error: any) {
        setStatus(`Error: ${error.message}`);
      }
    };

    getUrlData();
  }, []); // [] = run once on component mount


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload

    if (!isValidUrl(url)) {
      setStatus(`This URL is invalid. Please re-submit with a valid url (https://www.test.com)`);
      return
    }
    // You can also trigger API calls or state updates here

    try {
      const response = await axios.post('http://localhost:8080/api/url_shortener', { url: url }); // change to your API URL
      setUrlData(response.data.data.urlData)
      setStatus(`Success! The URL has been shortened.`);

    } catch (error: any) {
      setStatus(`This URL has already been shortened`);
    }

  };

  return (

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>
          URL Shortener App
        </h3>

      </header>
      <p>
        <form onSubmit={handleSubmit}>
          <label>
            Enter your URL here:
          </label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} type="text" />
          <button type="submit">Submit</button>

          <p>{status}</p>
        </form>
      </p>
      <p>
        <DataTable data={urlData} />

      </p>
    </div>
  );
}

export default App;
