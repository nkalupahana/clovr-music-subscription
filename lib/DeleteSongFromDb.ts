export const deleteSongFromDb = async (songId: string) => {
    const response = await fetch(`/api/music/remove?songId=${songId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
        // include additional headers if necessary, such as authorization tokens
    });

    if (!response.ok) {
        // Handle non-successful responses here
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return await response.json(); // or handle the response as needed
};
