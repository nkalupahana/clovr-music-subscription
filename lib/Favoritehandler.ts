export const getFavoriteSongs = async () => {
  try {
    const response = await fetch(`/api/my/favorites`);
    const data = await response.json();
    return data;
  } catch (e) {
    return null;
  }
}

export const toggleFavoriteSong = async (songID: String, set: Boolean) => {
  try {
    const response = await fetch(`/api/music/favorite?id=${songID}&set=${set}`);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
