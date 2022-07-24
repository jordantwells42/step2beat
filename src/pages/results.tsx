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
  const { tempos, artists } = router.query;
  const { data: session } = useSession();



  if (session) {
    return (
      <div className="flex flex-col relative">
        <Footer />
      </div>
    );
  } else {
    return <Login />;
  }
}
