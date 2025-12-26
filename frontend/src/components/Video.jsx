import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Video = ({
  videoSrc,
  className = "",
  fallback = "/default-avatar.png",
}) => {
  const axios = useAxiosPrivate();
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const fetchVideo = async () => {
      if (!videoSrc) return;

      try {
        const response = await axios.get(`public/${videoSrc}`, {
          responseType: "blob",
        });
        objectUrl = URL.createObjectURL(response.data);

        if (isMounted) setVideoUrl(objectUrl);
      } catch (error) {
        console.error("Video load failed", error);
        if (isMounted) setVideoUrl(fallback);
      }
    };

    fetchVideo();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoSrc, axios, fallback]);

  return (
    <video
      src={videoUrl || fallback}
      className={`rounded-lg object-cover ${className}`}
      controls
    />
  );
};

export default Video;
