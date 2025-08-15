// import React, { useState, useEffect } from "react";
// import ReactPlayer from "react-player";
// import "./style.scss";

// const VideoPopup = ({ show, setShow, videoId, setVideoId }) => {
//   const [playing, setPlaying] = useState(false);

//   const hidePopup = () => {
//     setPlaying(false); // Stop playing before hiding
//     setShow(false);
//     setVideoId(null);
//   };

//   // Handle play state when popup shows/hides
//   useEffect(() => {
//     if (show && videoId) {
//       // Small delay to ensure popup is visible before playing
//       const timer = setTimeout(() => {
//         setPlaying(true);
//       }, 300);
//       return () => clearTimeout(timer);
//     } else {
//       setPlaying(false);
//     }
//   }, [show, videoId]);

//   // Handle ESC key
//   useEffect(() => {
//     const handleEsc = (event) => {
//       if (event.keyCode === 27) {
//         hidePopup();
//       }
//     };
//     if (show) {
//       document.addEventListener("keydown", handleEsc);
//     }
//     return () => {
//       document.removeEventListener("keydown", handleEsc);
//     };
//   }, [show]);

//   if (!videoId) return null;

//   return (
//     <div className={`videoPopup ${show ? "visible" : ""}`}>
//       <div className="opacityLayer" onClick={hidePopup}></div>
//       <div className="videoPlayer">
//         <span className="closeBtn" onClick={hidePopup}>
//           ✕ Close
//         </span>
//         {show && (
//           <ReactPlayer
//             url={`https://www.youtube.com/watch?v=${videoId}`}
//             controls
//             width="100%"
//             height="100%"
//             playing={playing}
//             onError={(error) => {
//               console.error("Video player error:", error);
//             }}
//             onReady={() => {
//               console.log("Video ready to play");
//             }}
//             config={{
//               youtube: {
//                 playerVars: {
//                   autoplay: 1,
//                   modestbranding: 1,
//                   rel: 0,
//                 },
//               },
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoPopup;

import React, { useEffect } from "react";
import "./style.scss";

const VideoPopup = ({ show, setShow, videoId, setVideoId }) => {
  const hidePopup = () => {
    setShow(false);
    setVideoId(null);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        hidePopup();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEsc);
      // Prevent body scroll when popup is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show || !videoId) return null;

  return (
    <div className="videoPopup visible">
      <div className="opacityLayer" onClick={hidePopup}></div>
      <div className="videoPlayer">
        <span className="closeBtn" onClick={hidePopup}>
          ✕ Close
        </span>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0`}
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPopup;