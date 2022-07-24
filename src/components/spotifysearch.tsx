/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import PlusIcon from "./plusicon";
import { motion } from "framer-motion";
import tinycolor from "tinycolor2";
import textColor from "../libs/textColor";

export default function SpotifySearch({
  display,
  setArtists,
}: {
  display: boolean;
  setArtists: Dispatch<SetStateAction<any[]>>;
}) {
  const [spotifyArtists, setSpotifyArtists] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const search = (query: string) => {
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setSearchResults(data));
  };

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    search(e.target.value);
  }

  function handleSelect(artist: any) {
    setSpotifyArtists((p) => [...p, artist]);
    setSearchQuery("");
    setSearchResults(null);
    setArtists((p: any) => [
      ...p,
      {
        name: artist.name,
        id: artist.id,
        image: artist.images[0] ? artist.images[0].url : null,
        genre: artist.genres[0],
      },
    ]);
  }

  return (
    <motion.div
      
      animate={{
        display: display ? "block" : "none",
        x: display ? 0 : -10,
      }}
      onBlur={() => [setSearchQuery(""), setSearchResults(null)]}
      className="bg-aluminium-900 text-aluminium-100 absolute top-0 flex w-full md:w-3/4 flex-col items-center justify-center rounded-2xl p-1"
    >
      <input
        value={searchQuery}
        placeholder={"Doja Cat"}
        className="w-5/6 rounded-2xl p-2 m-2 items-center justify-center flex placeholder-aluminium-300 text-aluminium-900 "
        onChange={handleChange}
      />
      <div className="flex w-full flex-col items-center justify-start pl-2">
        {searchResults &&
          searchResults.map((artist: any, idx: number) => (
            <motion.div
              key={artist.id}
              initial={{x: -10}}
              animate={{x:0}}
              className="flex h-full w-full items-center justify-start gap-2 last:pb-4"
              onMouseDown={() => handleSelect(artist)}
            >
              {artist.images[0] ? (
                <img
                  className="aspect-square w-10"
                  src={artist.images[0].url}
                  alt={artist.name}
                />
              ) : (
                <div className="aspect-square w-10"></div>
              )}
              <div className="flex w-3/4 h-full flex-col justify-start overflow-x-hidden">
                <h1 className="font-bold whitespace-nowrap truncate">{artist.name}</h1>
                <h2 className="capitalize whitespace-nowrap truncate">
                  {artist.genres.slice(0, 1).join(", ")}
                </h2>
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}
