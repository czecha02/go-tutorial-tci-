# Go Tutorial with TCI Branding

An interactive 9×9 Go tutorial built with React, TypeScript, and Next.js, featuring TCI branding and comprehensive learning modules.

## Features

### 🎯 Core Game Features
- **Pixel-perfect SVG board** with precise geometric alignment
- **Interactive stone placement** with hover preview and animations
- **Complete Go rules engine** including capture, ko rule, and suicide prevention
- **Real-time game state** with captured stone tracking

### 📚 Learning Modules
- **Rules & Liberties** - Basic stone placement and breathing spaces
- **Capture Mechanics** - How to capture enemy groups
- **Ko Rule** - Understanding and handling ko fights
- **Eyes & Life** - Making groups alive with two eyes
- **Territory Counting** - Understanding the goal of Go
- **Shape Patterns** - Good vs bad shape with interactive examples

### 🎨 TCI Branding
- **TCI color palette** with CSS custom properties
- **TCI logo integration** in header
- **Brand-consistent UI** with TCI green primary color
- **Professional styling** throughout the application

### ♿ Accessibility
- **Keyboard navigation** for board intersections
- **ARIA labels** for screen readers
- **High contrast** stone markers
- **Reduced motion** support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom TCI theme
- **Testing**: Vitest with React Testing Library
- **Icons**: Custom SVG components

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd go-tutorial-tci
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with TCI theme
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Home page
│   ├── practice/          # Practice game page
│   ├── rules/             # Rules lesson
│   ├── capture/           # Capture lesson
│   ├── ko/                # Ko rule lesson
│   ├── eyes/              # Eyes & life lesson
│   ├── counting/          # Territory counting lesson
│   └── shapes/            # Shape patterns lesson
├── components/            # React components
│   ├── BoardSvg.tsx       # Main SVG board component
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Footer with TCI branding
├── lib/                   # Game engine and utilities
│   ├── engine.ts          # Complete Go rules engine
│   └── __tests__/         # Engine tests
├── brand/                 # TCI branding system
│   └── brand.ts           # Color tokens and assets
├── content/               # Lesson content
│   └── strings.ts         # All lesson text and explanations
└── test/                  # Test configuration
    └── setup.ts           # Test environment setup
```

## Key Components

### BoardSvg Component
- **Pixel-perfect alignment** using SVG coordinates
- **Hover preview** with circular ghost stones
- **Scale-in animations** for stone placement
- **Coordinate labels** (A-I, 9-1) with proper positioning
- **Accessibility** with ARIA labels and keyboard support

### Game Engine
- **Complete Go rules** implementation
- **Legal move validation** including suicide and ko
- **Capture detection** with group analysis
- **Liberty calculation** for group safety
- **Move explanation** for AI hints

### TCI Branding
- **Color system** with CSS custom properties
- **Consistent styling** across all components
- **Professional appearance** with TCI green primary
- **Logo integration** in header and footer

## Learning Path

1. **Start with Rules** - Learn basic stone placement and liberties
2. **Practice Capturing** - Understand how to capture enemy groups
3. **Master Ko Fights** - Learn to handle ko situations
4. **Build Eyes** - Create living groups with two eyes
5. **Count Territory** - Understand the goal of Go
6. **Study Shapes** - Learn good vs bad patterns
7. **Practice Game** - Apply everything in a full game

## Customization

### TCI Colors
Update the color values in `src/brand/brand.ts` and `src/app/globals.css`:

```typescript
export const TCI = {
  green: "#7CC04B",    // Primary brand color
  dark: "#233238",     // Dark text and accents
  light: "#F4F7F6",    // Light background
  white: "#FFFFFF",    // Pure white
  boardWood: "#F2D28C" // Board color
}
```

### Adding New Lessons
1. Add lesson content to `src/content/strings.ts`
2. Create new page in `src/app/[lesson-name]/page.tsx`
3. Update navigation in `src/components/Header.tsx`

## Testing

The project includes comprehensive tests for:
- **Game engine logic** (legal moves, capture, ko)
- **Board geometry** (pixel-perfect alignment)
- **Component rendering** (stones, labels, hover)
- **Accessibility** (ARIA labels, keyboard navigation)

Run tests with:
```bash
npm run test
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Other Platforms
1. Build the project: `npm run build`
2. Deploy the `.next` folder to your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **TCI** - The Corporate Intelligence for branding and design
- **Go community** - For rules and strategy insights
- **React/Next.js** - For the excellent development framework













