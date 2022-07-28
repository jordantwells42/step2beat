/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import tinycolor from "tinycolor2";
import { motion } from "framer-motion";
import textColor from "../libs/textColor";
import featuresToColors from "../libs/featuresToColor";
import Login from "../components/login";
import { useSession } from "next-auth/react";
import SongCard from "../components/songcard";
import Link from "next/link";
import Footer from "../components/footer";
import speedToTempo from "../libs/speedToTempo";
import useMeasure from "react-use-measure";

export default function Results() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  let { speedsStr, artists } = router.query;
  const speeds = (speedsStr ? JSON.parse(speedsStr as string) : []) as {
    speed: number;
    walking: boolean;
  }[];
  const tempos = speedsToTempos(speeds);

  function speedsToTempos(speeds: { speed: number; walking: boolean }[]) {
    let tempos = [];
    if (!speeds) {
      return [];
    }

    for (let speed of speeds) {
      tempos.push(speedToTempo(speed));
    }
    return tempos;
  }
  const { data: session } = useSession();
  console.log(tempos, artists);

  useEffect(() => {
    if (tempos) {
      setSongs([]);
      const reccs: any[] = [];
      for (let i = 0; i < tempos.length; i++) {
        const tempo = tempos[i];
        console.log(tempo);
        fetch(`/api/recommend-from-tempo?tempo=${tempo}&artists=${artists}`)
          .then((res) => res.json())
          .then((res) => {
            const newObj = { ...res[0] };
            newObj.tempo = tempo;
            newObj.idx = i;
            setSongs((p) => [...p, newObj].sort((a, b) => a.idx - b.idx));
          });
      }
    }
  }, []);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");

  function handleCreatePlaylist() {
    fetch(
      `/api/create-playlist?name=${playlistName}&ids=` +
        songs
          .map((s) => s.id)
          .map((s) => "spotify:track:" + s)
          .join(",") +
        `&description=step2beat: ${speeds.map(s => s.speed).join(", ")} mph`
    )
      .then((res) => res.json())
      .then((data) => {
        setPlaylistUrl(data.external_urls.spotify);
      });
  }

  const justSpeeds = speeds.map((s) => s.speed);
  let [ref, bounds] = useMeasure();
  const data: [number, number][] = speeds.map((s, idx) => [idx, s.speed]);
  const [dragging, setDragging] = useState(false);
  let margin = {
    top: 150,
    right: 40,
    bottom: 40 + 75,
    left: 0,
  };
  const width = bounds.width > 700 ? bounds.width / 2 : bounds.width / 1.25;
  const height = speeds.length * 150;
  let yScale = d3
    .scaleLinear()
    .domain([0, speeds.length - 1])
    .range([margin.top, height - margin.bottom]);

  let xScale = d3
    .scaleLinear()
    .domain([0, Math.min(Math.max(...justSpeeds) + 1, 15)])
    .range([margin.left, width - margin.right]);

  let line = d3
    .line()
    .x((d) => xScale(d[1]))
    .y((d) => yScale(d[0]))
    .curve(d3.curveNatural);

  let d = line(data);
  if (session) {
    return (
      <div
        ref={ref}
        className="relative bg-green-100 text-red-600 min-h-screen w-full overflow-x-hidden"
      >
        <div className="w-full lg:absolute lg:top-20 lg:right-20 lg:w-96 z-20">
          <h1 className="text-4xl p-10 bg-spotify-200 lg:rounded-t-2xl text-white text-left font-semibold">
            Your Step 2 Beat
          </h1>
          <div className="flex w-full flex-col lg:rounded-b-2xl bg-stone-800 p-3 text-xl ">
            <div className="flex w-full flex-row items-center justify-between">
              <input
                value={playlistName}
                onChange={(evt) => setPlaylistName(evt.target.value)}
                className="h-1/2  w-3/4 rounded-xl p-2 text-stone-900"
                placeholder="My Step 2 Beat"
              ></input>
              <button
                style={{
                  backgroundColor: tinycolor("#1ed760")
                    .desaturate(40)
                    .toHexString(),
                }}
                className="mx-3 hover:border-b-2 h-1/2 w-1/2 rounded-xl p-2 text-white hover:cursor-pointer"
                onClick={handleCreatePlaylist}
              >
                Save Playlist
              </button>
            </div>
            {playlistUrl && (
              <div className="mt-2 flex w-full truncate whitespace-nowrap  text-white hover:text-green-200">
                <img
                  className="m-1 aspect-square w-5 origin-center object-contain"
                  alt="Spotify Logo"
                  src="/spotify.png"
                />
                <a href={playlistUrl}>View Playlist</a>
              </div>
            )}
          </div>
        </div>
        <div style={{ width: width }} className={`relative`}>
          <svg
            className="text-aluminium-300 "
            viewBox={`0 0 ${width} ${height}`}
          >
            {/* Line */}
            {d && (
              <>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, type: "spring" }}
                  d={d}
                  fill="none"
                  stroke="none"
                  strokeWidth="10"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, type: "spring" }}
                  d={
                    d +
                    "L " +
                    0 +
                    " " +
                    (height - margin.bottom + 100) +
                    "L " +
                    0 +
                    " " +
                    -1000
                  }
                  fill="#83e4a8"
                  stroke="none"
                  strokeWidth="10"
                />
              </>
            )}
          </svg>
          {/* Circles */}
          <div className="absolute top-0 h-full w-screen">
            {songs &&
              speeds.map((speed, idx) => {
                const song = songs[idx];

                return (
                  song && (
                    <div
                      className="absolute w-4/5 lg:w-1/3 flex items-center justify-center"
                      style={{
                        transform: `translate(${bounds.width > 700 ? xScale(speed.speed) + 10 : 0}px, ${
                          yScale(idx) - 100
                        }px)`,
                      }}
                      key={idx}
                    >
                      <SongCard
                        song={song}
                        color={tinycolor("#b2ecc2")}
                        tempo={String(speed.speed) + " mph"}
                      />
                    </div>
                  )
                );
              })}
          </div>
        </div>
        {/*songs &&
          songs.map((song, idx) => (
            <div key={idx} className="">
              <h1>{song.tempo}</h1>
              <SongCard song={song} color={tinycolor("#222")} />
            </div>
          ))*/}
        <Footer />
      </div>
    );
  } else {
    return <Login />;
  }
}
