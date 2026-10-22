function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const photoId = action.payload

      if (state.includes(photoId)) {
        return state.filter((id) => id !== photoId)
      }

      return [...state, photoId]
    }

    default:
      return state
  }
}

export default favouritesReducer