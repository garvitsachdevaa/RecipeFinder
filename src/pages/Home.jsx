import { useState, useEffect } from "react"

function Home() {
  const [query, setQuery] = useState("")
  const [recipes, setRecipes] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites")
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showFavOnly, setShowFavOnly] = useState(false)

  const displayedRecipes = showFavOnly ? favourites : recipes

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites))
  }, [favourites])

  async function handleSearch() {
    if (!query.trim()) return

    setHasSearched(true)
    setLoading(true)

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      )
      const data = await res.json()
      setRecipes(data.meals || [])
    } catch (error) {
      console.log("error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  function toggleDetails(id) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  function toggleFavourite(recipe) {
    setFavourites((prev) => {
      const exists = prev.find((r) => r.idMeal === recipe.idMeal)

      if (exists) {
        return prev.filter((r) => r.idMeal !== recipe.idMeal)
      } else {
        return [...prev, recipe]
      }
    })
  }

  return (
    <div>
      <h1>Recipe Finder</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* Top bar */}
      <p>Favorites: {favourites.length}</p>
      <button onClick={() => setShowFavOnly((prev) => !prev)}>
        {showFavOnly ? "Show All" : "Show Favorites"}
      </button>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Empty */}
      {!loading && hasSearched && displayedRecipes.length === 0 && (
        <p>No results found</p>
      )}

      {/* Recipes */}
      <div>
        {displayedRecipes.map((recipe) => {
          const isFav = favourites.some(
            (r) => r.idMeal === recipe.idMeal
          )

          return (
            <div key={recipe.idMeal}>
              <h3>{recipe.strMeal}</h3>
              <img src={recipe.strMealThumb} width="200" />

              <button onClick={() => toggleDetails(recipe.idMeal)}>
                {expandedId === recipe.idMeal
                  ? "Hide details"
                  : "Show details"}
              </button>

              <button onClick={() => toggleFavourite(recipe)}>
                {isFav ? "♥" : "♡"}
              </button>

              {expandedId === recipe.idMeal && (
                <p>{recipe.strInstructions}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home