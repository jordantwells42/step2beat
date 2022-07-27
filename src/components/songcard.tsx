/* eslint-disable @next/next/no-img-element */
import tinycolor from "tinycolor2";
import { motion } from "framer-motion";
import textColor from "../libs/textColor";
import Player from "./player";
import { useRef, useState } from "react";
import SongImage from "./songimage";
export default function SongCard({
  song,
  color,
  tempo,
}: {
  song: any;
  color: tinycolor.Instance;
  tempo: string
}) {
  const playerRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const handleClick = () => {
    if (playerRef.current) {
      if (playing) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const variants: any = {
    playing: {
      scale: 1.02,
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        duration: 0.3,
      },
    },
    paused: {
      scale: 1.0,
      transition: {},
    },
  };
  
  return (
    song.album && (
      <motion.div
        initial={{ x: -20, backgroundColor: "#222" }}
        animate={{ x: 0, backgroundColor: color.toHexString() }}
        className={`flex h-24 flex-row w-full items-center rounded-2xl p-2 hover:bg-green-700 text-aluminium-900`}
        key={song.id}
        onClick={song.preview_url && handleClick}
      >
        <motion.div
          variants={variants}
          animate={playing ? "playing" : "paused"}
          className="relative h-full"
        >
          <div className="flex flex-col relative aspect-square h-full mx-3 rounded-xl">
            <SongImage
              songName={song.name}
              imgUrl={song.album.images[1].url}
              spotifyUrl={song.external_urls.spotify}
            />
          {song.preview_url && (
            <div className="absolute  hover:backdrop-brightness-50 h-full mx-2.5 aspect-square opacity-0 hover:opacity-100 flex top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              {!playing ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-1/2 w-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-1/2 w-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
          )}
          </div>
        </motion.div>

        <div className="flex h-full mx-3 w-full flex-row items-start justify-start overflow-x-hidden">
          <a
            href={song.external_urls.spotify}
            className="flex w-full flex-col items-start justify-start overflow-x-hidden"
          >
            <h2 className="w-full truncate whitespace-nowrap text-left font-bold">
              {song.name}
            </h2>
            <p className="w-full truncate whitespace-nowrap text-left">
              {song.artists[0].name}
            </p>
            <p className="w-full truncate whitespace-nowrap text-left">
              {tempo}
            </p>
          </a>
        </div>

        <audio ref={playerRef} className="w-full">
          <source src={song.preview_url}></source>
        </audio>
      </motion.div>
    )
  );
}
