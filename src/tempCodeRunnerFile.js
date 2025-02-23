import React from 'react';
import './App.css'; // Stilleri saklamak için kullanabiliriz.

function App() {
  return (
    <div className="App">
      <header>
        <h1>Air Drum Uygulaması</h1> {/* Başlık */}
        <p>
          Hoş geldiniz! Bu uygulama, kamera hareketlerinizi algılayarak davul çalmanızı sağlar.
        </p> {/* Açıklama */}
        <button onClick={() => alert('Uygulama başlıyor!')}>Başlat</button> {/* Basit bir buton */}
      </header>
    </div>
  );
}

export default App;
