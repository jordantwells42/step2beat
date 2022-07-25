/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
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

export default function Results() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  let { tempos, artists } = router.query;
  const { data: session } = useSession();
  console.log(tempos, artists);

  useEffect(() => {
    if (tempos) {
      setSongs([])
      const reccs: any[] = [];
      for (let i = 0; i < (tempos as string).split(",").length; i++) {
        const tempo = (tempos as string).split(",")[i];
        console.log(tempo)
        fetch(`/api/recommend-from-tempo?tempo=${tempo}&artists=${artists}`)
          .then((res) => res.json())
          .then((res) => {
            const newObj = {...res[0]}
            newObj.tempo = tempo;
            newObj.idx = i;
            setSongs(p => [...p, newObj].sort((a, b) => a.idx - b.idx));
          });
      }
    }
  }, []);
  console.log(songs)
  if (session) {
    return (
      <div className="relative h-full flex flex-row flex-wrap  min-h-screen">
        {songs &&
          songs.map((song, idx) => (
            <div key={idx} className=''>
              <h1>{song.tempo}</h1>
              <SongCard song={song} color={tinycolor("#222")} />
            </div>
          ))}
        <Footer />
      </div>
    );
  } else {
    return <Login />;
  }
}
