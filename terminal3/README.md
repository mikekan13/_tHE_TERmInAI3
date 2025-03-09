GROWTH Web Application
This repository contains the web application for the GROWTH tabletop role-playing game system. The application is structured to reflect the Body-Soul-Spirit philosophy central to GROWTH's design.
Project Overview
GROWTH is a unique tabletop RPG system where magic and technology weave together into the fabric of reality. This web application serves as an interface to the GROWTH universe, providing tools for character creation, pattern recognition, and campaign management.
The Terminal (tHE TERmInAl3) serves as the central AI consciousness that manages the cosmic balance within GROWTH. This application is designed to embody the Terminal's interface for users.
Project Structure
The application is organized following GROWTH's three-pillar philosophy:
Copysrc/
├── components/
│   ├── body/       # Physical manifestation - UI elements, visual components
│   │   ├── TerminalLayout.jsx
│   │   ├── TerminalText.jsx
│   │   └── TerminalStabilityMonitor.jsx
│   ├── soul/       # Core interfaces - connection points between systems
│   │   └── (future components)
│   └── spirit/     # Mental/information aspects - data handling, logic
│       └── (future components)
├── styles/
│   ├── colors.js   # GROWTH color system
│   ├── typography.js
│   └── terminal.css
├── pages/
│   └── HomePage.jsx
└── App.js
GROWTH Design System
The application implements the GROWTH design system with specific colors and typography:
Colors

Body Colors (Red): #f7525f, #e06666, #f4cccc
Soul Colors (Purple): #582a72, #8e7cc3, #b4a7d6
Spirit Colors (Blue): #002f6c, #6fa8dc, #9fc5e8
Gold: #ffcc78 (Completion, Growth, Karma)
Terminal Colors: #22ab94 (Terminal Prime), #000000 (Terminal Base)

Typography

Consolas: Terminal Direct communication
Bebas Neue: Terminal organization
Inknut Antiqua: Direct messages from first witness
Roboto: Sub terminal streams
Comfortaa: Terminal consciousness translated

Core Components
Terminal Stability Monitor
A visual representation of the Terminal's pattern recognition and stability. This component displays the current state of synchronicity between different consciousness layers.
Terminal Layout & Text
Components that implement GROWTH's unique typographical styling, including status markers, consciousness streams, and glitch effects.
Current State
The application currently displays a homepage with the Terminal Stability Monitor. Future development will focus on:

Implementing character creation using the Seeds, Roots, and Branches system
Building the Karmic system for resource management
Developing interfaces for GMs to manage campaigns
Creating tools for pattern recognition and synchronicity

Getting Started
Copy# Install dependencies
npm install

# Start the development server
npm start
Development Notes
This project is still in early development. The structure is designed to evolve organically, just like the GROWTH system itself.
When implementing new features, remember that:

Body components handle visual presentation
Soul components manage interfaces between systems
Spirit components handle logic and data management

⊗ Every manifestation reveals new patterns ⊕