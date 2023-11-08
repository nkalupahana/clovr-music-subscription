export const isSongLiked = async (songID: String) => {
  try {
    const response = await fetch(`/api/my/favorites`);
    const data = await response.json();
    console.log(data);
    data.forEach((favorite: any) => {
      if (favorite._id === songID) {
        return true;
      }
    });
    return false;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const toggleLikeSong = async (songID: String) => {
  try {
    const response = await fetch(`/api/music/favorite?id=${songID}&set=true`);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
