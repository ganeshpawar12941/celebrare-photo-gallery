import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import useFetchPhotos from './hooks/useFetchPhotos'
import favouritesReducer from './reducers/favouritesReducer'

function App() {
  const { photos, loading, error } = useFetchPhotos()

  const [searchTerm, setSearchTerm] = useState('')

  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    () => {
      try {
        const savedFavourites = localStorage.getItem('favourites')
        return savedFavourites ? JSON.parse(savedFavourites) : []
      } catch {
        return []
      }
    }
  )

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [photos, searchTerm])

  const toggleFavourite = (photoId) => {
    dispatch({
      type: 'TOGGLE_FAVOURITE',
      payload: photoId,
    })
  }

  if (loading) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      <p className="text-lg font-medium text-gray-600">
        Loading photos...
      </p>
    </div>
  )
}
  if (error) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6">
      <p className="text-xl font-semibold text-red-600">
        Unable to load photos
      </p>

      <p className="text-gray-600">{error}</p>

      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
        Photo Gallery
      </h1>

      <div className="mb-6 flex w-full justify-center">
        <input
          type="text"
          placeholder="Search by author name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <p className="mb-4 text-gray-600">
        Showing {filteredPhotos.length} of {photos.length} photos
      </p>

      {filteredPhotos.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No photos found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => {
            const isFavourite = favourites.includes(photo.id)

            return (
              <div
                key={photo.id}
                className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <img
                  src={`https://picsum.photos/id/${photo.id}/500/300`}
                  alt={`Photo by ${photo.author}`}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />

                <div className="flex items-center justify-between p-4">
                  <p className="font-medium text-gray-800">
                    {photo.author}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleFavourite(photo.id)}
                    aria-label={
                      isFavourite
                        ? 'Remove from favourites'
                        : 'Add to favourites'
                    }
                    aria-pressed={isFavourite}
                    className={`text-2xl transition-colors ${
                      isFavourite
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    {isFavourite ? '♥' : '♡'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default App