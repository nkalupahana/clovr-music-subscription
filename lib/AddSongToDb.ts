export async function addSongToDb(songData: any) {
  // Creating a FormData object to handle file uploads and text fields
  const formData = new FormData();
  // Appending text fields to the form data
  formData.append("songname", songData.title);
  formData.append("artist", songData.artist);
  formData.append("duration", songData.durationSeconds);
  formData.append("releaseDate", songData.releaseDate.toISOString());

  // Appending file fields to the form data

  formData.append("musicFile", songData.musicFile, songData.musicFile.name);
  formData.append("albumArtFile", songData.albumArt, songData.albumArt.name);

  try {
    // Making the POST request to your API endpoint using fetch
    const response = await fetch("/api/music/upload", {
      method: "POST",
      body: formData,
    });

    console.log(response);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Handling the response
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error uploading song:", error);
  }
}
