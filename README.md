# 🎨 Color Blindness Simulator

A web-based tool that simulates various types of color vision deficiencies, helping designers and developers understand how their work appears to users with different types of color blindness.

## 🌟 Features

- **Multiple Color Blindness Types**: Simulate 7 different types of color vision deficiencies
  - **Normal Vision**: Baseline for comparison
  - **Protanopia/Protanomaly**: Red-blind/Red-weak vision
  - **Deuteranopia/Deuteranomaly**: Green-blind/Green-weak vision  
  - **Tritanopia/Tritanomaly**: Blue-blind/Blue-weak vision
  - **Achromatopsia**: Complete color blindness (monochrome)

- **Multiple Algorithms**: Choose from different simulation algorithms
  - **Brettel**: Classic color blindness simulation
  - **Vienot**: Alternative algorithm for more accurate simulation
  - **Machado**: Default algorithm with good balance of accuracy

- **Adjustable Strength**: Control the intensity of the simulation (0-100%)

- **Image Upload**: Upload and process your own images to see how they appear to users with color blindness

- **Color Grid Preview**: Interactive color grid showing how different hues and saturations appear under each simulation

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd colorblind
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

### Basic Usage

1. **Select Color Blindness Type**: Click on the buttons to choose which type of color vision deficiency to simulate
2. **Adjust Strength**: Use the slider to control how strong the simulation effect is
3. **View Color Grid**: See how different colors appear under the selected simulation
4. **Upload Images**: Click "Choose File" to upload and process your own images

### Advanced Features

- **Algorithm Selection**: For certain color blindness types, you can choose between different simulation algorithms
- **Image Processing**: Upload images to see how they would appear to users with color blindness
- **Real-time Updates**: Changes to settings are applied immediately to both the color grid and uploaded images

## 🧪 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🛠️ Technical Details

### Color Transformation

The application uses color transformation matrices to simulate color blindness. Each type of color vision deficiency has specific transformation matrices that modify how colors are perceived:

- **Protanopia/Protanomaly**: Affects red cone sensitivity
- **Deuteranopia/Deuteranomaly**: Affects green cone sensitivity  
- **Tritanopia/Tritanomaly**: Affects blue cone sensitivity
- **Achromatopsia**: Converts all colors to grayscale

### Color Space Conversion

The simulation uses proper color space conversion:
1. Convert sRGB to linear RGB
2. Apply color transformation matrix
3. Convert back to sRGB
4. Blend with original color based on strength setting

## 🎯 Use Cases

- **Web Design**: Test color schemes and UI elements for accessibility
- **Graphic Design**: Ensure designs are accessible to users with color blindness
- **Education**: Learn about different types of color vision deficiencies
- **Development**: Test applications for color accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Color transformation matrices based on research by Brettel, Vienot, and Machado
- Built with React and Create React App