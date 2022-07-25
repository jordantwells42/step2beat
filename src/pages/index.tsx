/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import useMeasure from "react-use-measure";
import Login from "../components/login";
import Footer from "../components/footer";
import SpotifySearch from "../components/spotifysearch";
import WorkoutGraph from "../components/workoutgraph";
import { AnimatePresence, motion } from 'framer-motion';
import Link from "next/link";
import speedToTempo from "../libs/speedToTempo";

/*
TODO: 

[] - Get audio features of interpolated songs
[] - Ensure that the interpolated songs are unique 
[] - Style results page
[] - Allow export to Spotify playlists
[] - Allow sharing of url to share gradient
[] - General UI things
*/

function SignOut() {
  const { data: session } = useSession();
  return (
    <div
      className={
        "absolute top-0 right-0 flex flex-col rounded-2xl text-right justify-center items-end p-4 px-10 font-main font-medium text-aluminium-900 "
      }
    >
      Hey, {session?.user?.name}
      <button className="hover:text-blue-200" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [artists, setArtists] = useState<any[]>([]);
  const [speeds, setSpeeds] = useState<
    {
      speed: number;
      walking: boolean;
    }[]
  >([
    { speed: 3.0, walking: true },
    { speed: 3.25, walking: true },
    { speed: 3.5, walking: true },
    { speed: 4.5, walking: false },
    { speed: 6, walking: false },
    { speed: 2.5, walking: true },
  ]);
  let [ref, bounds] = useMeasure();

  function handleDelete(id: string) {
    setArtists((p) => p.filter((a) => a.id !== id));
  }

  function speedsToTempos(){
    let tempos = [];
    if (!speeds) { return [] }
    
    for (let speed of speeds) {
      tempos.push(speedToTempo(speed))
      
    }
    return tempos;
  }

  if (session) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-spotify-50  font-main text-aluminium-900">
        <div className="relative flex h-full w-full flex-col items-center justify-center py-5 lg:w-3/4">
          <h1 className="py-5 text-4xl font-bold">Step 2 Beat</h1>
          <div className="relative z-20 flex h-20 w-5/6 items-center justify-center">
            <SpotifySearch display={true} setArtists={setArtists} />
          </div>
          <div className="flex w-full flex-col items-center justify-center p-5 md:h-[400px] md:flex-row">
            <div className="m-2 h-[400px] w-full rounded-2xl bg-spotify-100 p-4 md:h-full md:w-1/4">
              <h1 className="text-2xl font-bold">Seed Artists</h1>
              <h2 className="pb-2 text-sm italic">Choose up to 5</h2>
              {artists.map((artist, idx) => (
                <motion.div
                  key={idx}
                  initial={{x:-20}}
                  animate={{x:0}}
                  className="flex w-full items-center justify-start gap-2"
                >
                  {artist.image ? (
                    <img
                      className="aspect-square w-12"
                      src={artist.image}
                      alt={artist.name}
                    />
                  ) : (
                    <div className="aspect-square w-12"></div>
                  )}
                  <div className="flex h-full w-full flex-col justify-start overflow-x-hidden">
                    <h1 className="truncate whitespace-nowrap font-bold">
                      {artist.name}
                    </h1>
                    <h2 className="truncate whitespace-nowrap capitalize">
                      {artist.genre}
                    </h2>
                  </div>
                  <button onClick={() => handleDelete(artist.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              ))}
              
              {[0, 0, 0, 0, 0]
                .splice(0, 5 - artists.length)
                .map((none, idx) => (
                  <div
                    key={1/(idx+2)}
                    className="h-12 border-2 border-spotify-400 rounded-2xl bg-spotify-300"
                  ></div>
                ))}
            </div>
            <div className="m-2 h-[400px] w-full rounded-2xl bg-spotify-100 p-4 md:h-full md:w-3/4 ">
              <div className="h-1/5">
              <h1 className="text-2xl font-bold">Your Workout</h1>
              <h2 className="pb-2 text-sm italic">Change it how you like</h2>
              </div>
              <div className="h-4/5" ref={ref}>
                {bounds.width > 0 && (
                  <WorkoutGraph
                    speeds={speeds}
                    setSpeeds={setSpeeds}
                    width={bounds.width}
                    height={bounds.height}
                  />
                )}
                
              </div>
              
            </div>
            
          </div>
          <Link
                  href={{
                    pathname: "/results",
                    query: { tempos:speedsToTempos().join(","), artists: artists.map((a) => a.id).join(",") },
                  }}
                >
          <button className="text-2xl bg-spotify-400 text-aluminium-900 p-4 rounded-2xl font-bold">
          Generate
        </button>
        </Link>
          
        </div>
       
        <SignOut />
        <Footer />
      </div>
    );
  }
  return <Login />;
};

export default Home;
