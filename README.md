# Recipe Finder

A React + Vite app to search meals, view cooking instructions, and save favorite recipes.

## Features

- Search recipes by name using TheMealDB API
- Press Enter or click Search to run search
- View full instructions in a clean modal (without breaking card layout)
- Add and remove favorites
- Persist favorites in local storage
- Responsive UI built with Tailwind CSS

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open the URL shown in terminal (usually http://localhost:5173).

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint checks

## Project Structure

```text
src/
	App.jsx
	main.jsx
	index.css
	pages/
		Home.jsx
```

## API Reference

This project uses TheMealDB search endpoint:

`https://www.themealdb.com/api/json/v1/1/search.php?s=<recipe-name>`

## Notes

- Favorites are stored in browser local storage under the key `favourites`.
- If no meals match a query, the app shows a "No results found" state.
