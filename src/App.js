import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import { colorBlindMatrices } from './matrices';
import { applyColorMatrix, rgbToCss, hsvToRgb } from './colorUtils';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

export default function App() {
  // State management for UI controls
  const [mode, setMode] = useState('normal'); //Current color blindness simulation mode
  const [algorithm, setAlgorithm] = useState('machado'); // Selected algorithm for simulation
  const [strength, setStrength] = useState(0.5); // Simulation strength (0-1)
  const [uploadedImage, setUploadedImage] = useState(null); // URL of uploaded image
  const [loading, setLoading] = useState(false); // Loading state for image processing
  const [error, setError] = useState(null); // Error message for invalid uploads

  // Canvas refs for image processing
  const imageCanvasRef = useRef(null); // Hidden canvas for orignal image
  const outputCanvasRef = useRef(null); // Canvas for displaying processed image

  // Debounce strength changes to improve performance during slider adjustments
  const debouncedStrength = useDebounce(strength, 100);

  // Get current color blindness mode configuration
  const colorBlindMode = colorBlindMatrices[mode];

  // Determine which transformation matrix to use
  // Some modes (normal, achromatopsia) have a single matrix
  // Others have multiple algorithms to choose from
  const matrix =
    mode === 'normal' || mode === 'achromatopsia'
      ? colorBlindMode.matrix
      : colorBlindMode.algorithms[algorithm];

  // Get available algorithms for current mode
  const algorithms = colorBlindMode.algorithms
    ? Object.keys(colorBlindMode.algorithms)
    : [];

  /**
   * Process uploaded image with color blindness simulation
   * 
   * This function:
   * 1. Loads the uploaded image
   * 2. Draws it to a hidden canvas
   * 3. Processes each pixel with the selected color transformation matrix
   * 4. Displays the result on the output canvas
   */
  const processImage = useCallback(() => {
    if (!uploadedImage) return;
    
    setLoading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = uploadedImage;
    
    img.onload = () => {
      const canvas = imageCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Scale down image for better performance (50% of original size)
      const scale = 0.5;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get image data for pixel manipulation
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Process each pixel (RGBA values)
      for (let i = 0; i < data.length; i += 4) {
        const rgb = [data[i], data[i + 1], data[i + 2]]; // RGB values
        const simRgb = applyColorMatrix(rgb, matrix, debouncedStrength); // Apply color transformation

        // Update pixel with simulated color
        data[i] = simRgb[0];     // Red
        data[i + 1] = simRgb[1]; // Green
        data[i + 2] = simRgb[2]; // Blue
        //data[i + 3] is alpha (transparency) - leave unchanged
      }

      // Display processed image
      const outputCanvas = outputCanvasRef.current;
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;

      const outputCtx = outputCanvas.getContext('2d');
      outputCtx.putImageData(imageData, 0, 0);
      setLoading(false);
    };
    
    img.onerror = () => {
      // Handle image loadingerrors
      setLoading(false);
    };
  }, [uploadedImage, matrix, debouncedStrength]);

  /**
   * Effect to process image when settings change
   * Uses debounced strength to avoid excessive processing during slider adjustments
   */
  useEffect(() => {
    if (!uploadedImage) return;

    const handler = setTimeout(() => {
      if (imageCanvasRef.current && outputCanvasRef.current) {
        processImage();
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [uploadedImage, matrix, debouncedStrength, processImage]);

  /**
   * Cleanup effect to revoke object URLs when component unmounts
   * Prevents memory leaks from uploaded images
   */
  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  /**
   * Handle file upload with validation
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type - must be an image
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size - max 10MB to prevent performance issues
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB');
        return;
      }
      
      setError(null);
      
      // Clean up previous image URL to prevent memory leaks
      if (uploadedImage) URL.revokeObjectURL(uploadedImage);
      
      // Create object URL for new image
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🎨 Color Blindness Simulator</h1>

      {/* File Upload Section */}
      <section className="file-input-section">
        <input
          type="file"
          accept="image/*"
          className="file-input"
          onChange={handleFileChange}
          title="Upload an image to simulate color blindness"
        />
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </section>

      {/* Clear Image Button */}
      <section className="file-input-section">
        {uploadedImage && (
          <button
            className="clear-image-button"
            onClick={() => setUploadedImage(null)}
            aria-label="Clear uploaded image"
          >
            Clear Image
          </button>
        )}
      </section>

      {/* Color Blindness Type Selection */}
      <section className="mode-buttons-section">
        {Object.entries(colorBlindMatrices).map(([key, value]) => (
          <button
            key={key}
            className={`mode-button ${mode === key ? 'active' : ''}`}
            onClick={() => {
              setMode(key);
              setAlgorithm('machado'); // Reset to default algorithm
            }}
            title={value.label}
          >
            <div className="name">{value.name}</div>
            <div className="label">{value.label}</div>
          </button>
        ))}
      </section>

      {/* Simulation Strength Control */}
      <section className="strength-section">
        <label htmlFor="strengthRange" className="strength-label">
          Strength: <span className="strength-value">{Math.round(strength * 100)}%</span>
        </label>
        <input
          id="strengthRange"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={strength}
          onChange={(e) => setStrength(parseFloat(e.target.value))}
          className="strength-range"
        />
      </section>

      {/* Color Grid Preview (shown when no image is uploaded) */}
      {!uploadedImage && (
        <div className="color-grid-wrapper">
          <section
            aria-label="Color grid showing how different colors appear under the selected simulation"
            className="color-grid"
          >
            {/* Generate 12x24 grid of colors with varying hue and saturation */}
            {Array.from({ length: 12 }).map((_, row) => {
              const saturation = (row + 1) / 12; // Saturation increases from top to bottom
              return Array.from({ length: 24 }).map((_, col) => {
                const hue = (col / 23) * 360; // Hue varies from 0-360 degrees
                const rgb = hsvToRgb(hue, saturation, 1); // Convert HSV to RGB
                const simColor = applyColorMatrix(rgb, matrix, strength); // Apply simulation

                return (
                  <div
                    key={`${row}-${col}`}
                    title={`Hue: ${Math.round(hue)}°, Sat: ${saturation.toFixed(
                      2
                    )}\nOriginal: ${rgbToCss(rgb)}\nSimulated: ${rgbToCss(simColor)}`}
                    className="color-cell"
                    style={{ backgroundColor: rgbToCss(simColor) }}
                  />
                );
              });
            })}
          </section>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={imageCanvasRef} style={{ display: 'none' }} />

      {/* Processed Image Display */}
      {uploadedImage && (
        <section className="simulated-image-section">
          <h2 className="simulated-image-title">Simulated Image</h2>
          <div className="simulated-image-container">
            <canvas
              ref={outputCanvasRef}
              className="simulated-image-canvas"
            />
            {loading && (
              <div className="spinner-overlay" aria-label="Loading image processing">
                <div className="spinner" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Algorithm Selection (only shown for modes with multiple algorithms) */}
      <section className="algorithm-buttons-section">
        {(mode !== 'normal' && mode !== 'achromatopsia' && algorithms.length > 0) && (
          <>
            <div className="algorithm-label">Algorithm:</div>
            {algorithms.map((algoKey) => (
              <button
                key={algoKey}
                className={`algorithm-button ${algorithm === algoKey ? 'active' : ''}`}
                onClick={() => setAlgorithm(algoKey)}
              >
                {algoKey}
              </button>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
