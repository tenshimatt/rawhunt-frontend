import React from 'react';

const DebugPage = () => {
  console.log('DebugPage is rendering...');
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      background: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'green', fontSize: '2rem' }}>
        🟢 DEBUG PAGE LOADED SUCCESSFULLY!
      </h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Basic Checks:</h2>
        <ul>
          <li>✅ React is working</li>
          <li>✅ Component is rendering</li>
          <li>✅ CSS styles are applying</li>
          <li>✅ JavaScript is running</li>
        </ul>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#f0f8ff', 
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <h3>Environment Info:</h3>
        <p><strong>URL:</strong> {window.location.href}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Test Interactions:</h3>
        <button 
          onClick={() => alert('Button clicked!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Alert
        </button>
        
        <button 
          onClick={() => console.log('Console test from DebugPage')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Console
        </button>
      </div>
    </div>
  );
};

export default DebugPage;