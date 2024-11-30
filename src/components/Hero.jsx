import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;
  const mainVdRef = useRef(null); // Ref for the main video
  const nextVdRef = useRef(null); // Ref for the next video

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);

  // Main video entry animation
  useEffect(() => {
    if (mainVdRef.current) {
      gsap.fromTo(
        mainVdRef.current,
        {
          transformOrigin: "center center",
          scale: 1,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power1.inOut",
        }
      );
    }
  }, [currentIndex]);

  const handleMiniVdClick = () => {
    setHasClicked(true);

    // Animate current video out
    gsap.to(mainVdRef.current, {
      transformOrigin: "center center",
      scale: 1.5,
      opacity: 0,
      duration: 1,
      ease: "power1.inOut",
      onComplete: () => {
        // Update the index AFTER animation completes
        setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);

        // Animate next video in
        gsap.fromTo(
          nextVdRef.current,
          {
            transformOrigin: "center center",
            scale: 1,
            opacity: 0,
          },
          {
            scale: 1.5,
            opacity: 1,
            duration: 1,
            ease: "power1.inOut",
            onStart: () => nextVdRef.current?.play(), // Play next video during animation
          }
        );
      },
    });
  };

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
          <div
            onClick={handleMiniVdClick}
            className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
          >
            <video
              ref={nextVdRef}
              src={getVideoSrc((currentIndex % totalVideos) + 1)}
              loop
              muted
              id="current-video"
              className="size-64 origin-center scale-150 object-cover object-center"
              onLoadedData={handleVideoLoad}
            />
          </div>
        </div>
        <video
          ref={mainVdRef} // Attach the ref for animation
          src={getVideoSrc(currentIndex)}
          autoPlay
          loop
          muted
          id="main-video"
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={handleVideoLoad} // Keep track of video loading
        />
      </div>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
        G<b>A</b>MING
      </h1>
      <div className="absolute left-0 top-0 z-40 ">
        <div className="mt-10 px-5 sm:px-10">
          <h1 className="special-font hero-heading text-blue-100">
            redefi<b>n</b>e
          </h1>

          <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
            Enter the Metagame Layer <br /> Unleash the Play Economy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
