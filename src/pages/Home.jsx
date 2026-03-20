import { useState, useEffect } from "react"

function Home() {
  const [query, setQuery] = useState("")
  const [recipes, setRecipes] = useState([])
  const [expandedRecipeId, setExpandedRecipeId] = useState(null)
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites")
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showFavOnly, setShowFavOnly] = useState(false)

  const displayedRecipes = showFavOnly ? favourites : recipes
  const expandedRecipe = displayedRecipes.find(
    (recipe) => recipe.idMeal === expandedRecipeId
  )

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites))
  }, [favourites])

  async function handleSearch() {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) return

    setHasSearched(true)
    setLoading(true)
    setShowFavOnly(false)

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(normalizedQuery)}`
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
    setExpandedRecipeId((currentId) => {
      if (currentId === id) {
        return null
      }

      return id
    })
  }

  function getDetailsButtonText(id) {
    return expandedRecipeId === id ? "Hide details" : "Show details"
  }

  function handleSearchInputKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch()
    }
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
    <div className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-neon/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <section className="glass-panel p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 w-fit rounded-full border border-accent/30 bg-linear-to-r from-accent/20 via-white/70 to-neon/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-accent shadow-[0_8px_30px_rgba(99,102,241,0.18)] backdrop-blur-md">
                Kitchen Companion
              </p>
              <h1 className="text-4xl font-black tracking-tight text-text sm:text-5xl">
                Recipe Finder
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-text2 sm:text-base">
                Discover delicious meals in seconds, view step-by-step
                instructions, and save your favorites in one place.
              </p>
            </div>

            <div className="w-full max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchInputKeyDown}
                  className="h-12 w-full rounded-full border border-border bg-white/70 px-4 text-sm text-text outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/15"
                />
                <button
                  onClick={handleSearch}
                  className="btn-primary inline-flex h-12 items-center justify-center rounded-full px-8 leading-none"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm font-semibold text-text2 sm:text-base">
            Favorites: <span className="text-text">{favourites.length}</span>
          </p>
          <button className="btn-secondary w-full sm:w-auto" onClick={() => setShowFavOnly((prev) => !prev)}>
            {showFavOnly ? "Show All" : "Show Favorites"}
          </button>
        </section>

        {loading && (
          <div className="glass-panel p-6 text-center text-sm font-semibold text-text2 sm:text-base">
            Loading...
          </div>
        )}

        {!loading && hasSearched && displayedRecipes.length === 0 && (
          <div className="glass-panel p-8 text-center">
            <p className="text-base font-semibold text-text2 sm:text-lg">No results found</p>
          </div>
        )}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {displayedRecipes.map((recipe) => {
            const isFav = favourites.some(
              (r) => r.idMeal === recipe.idMeal
            )

            return (
              <article key={recipe.idMeal} className="recipe-card flex h-full flex-col gap-4">
                <h3 className="text-xl font-extrabold leading-tight text-text">
                  {recipe.strMeal}
                </h3>

                <img
                  src={recipe.strMealThumb}
                  width="200"
                  className="h-52 w-full rounded-r2 object-cover"
                  alt={recipe.strMeal}
                />

                <div className="mt-auto flex items-center gap-3">
                  <button
                    className="btn-secondary flex-1"
                    onClick={() => toggleDetails(recipe.idMeal)}
                  >
                    {getDetailsButtonText(recipe.idMeal)}
                  </button>

                  <button
                    className="h-11 w-11 rounded-full border border-border bg-white/70 text-2xl leading-none text-accent transition hover:scale-105 hover:border-accent/50"
                    onClick={() => toggleFavourite(recipe)}
                  >
                    {isFav ? "♥" : "♡"}
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      </div>

      {expandedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <button
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            onClick={() => setExpandedRecipeId(null)}
            aria-label="Close details"
          />

          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-r2 border border-white/40 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl">
            <div className="flex items-start gap-4 border-b border-border px-5 py-4 sm:px-6">
              <img
                src={expandedRecipe.strMealThumb}
                alt={expandedRecipe.strMeal}
                className="h-16 w-16 rounded-r object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">
                  Instructions
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-text sm:text-xl">
                  {expandedRecipe.strMeal}
                </h3>
              </div>

              <button
                className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-bold text-text2 transition hover:border-accent/40 hover:text-text"
                onClick={() => setExpandedRecipeId(null)}
              >
                Close
              </button>
            </div>

            <p className="custom-scrollbar max-h-[60vh] overflow-y-auto px-5 py-4 text-sm leading-7 whitespace-pre-line wrap-break-word text-text2 sm:px-6 sm:py-5">
              {expandedRecipe.strInstructions}
            </p>
          </div>
        </div>
      )}
    </div>
   )
}

export default Home