export const handleDownload = (id: string) => {
    window.open(`/api/music/download?id=${id}`);
  };