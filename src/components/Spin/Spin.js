import React, { useState } from 'react';
import './SpinWheel.css';

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);

  const spinWheel = () => {
    if (!spinning) {
      setSpinning(true);
      const deg = Math.floor(Math.random() * 360) + 4320; // Spin 12 full rotations (12 * 360)
      const wheel = document.getElementById('wheel');
      wheel.style.transition = 'transform 3s cubic-bezier(0.4, 2.2, 0.3, 1)';
      wheel.style.transform = `rotate(${deg}deg)`;
      setTimeout(() => {
        setSpinning(false);
        wheel.style.transition = 'none';
        const selectedSection = document.elementFromPoint(150, 10); // Check which section is at the top after spinning
        if (selectedSection && selectedSection.classList.contains('section')) {
          alert(`You won ${selectedSection.innerText}!`);
        }
      }, 3000);
    }
  };

  return (
    <div className="container">
      <div className="wheel" id="wheel">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className={`section ${index % 2 === 0 ? 'red' : 'white'}`}
            style={{ '--deg': index * 30 }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <button className="spin-button" onClick={spinWheel} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
};

export default SpinWheel;
