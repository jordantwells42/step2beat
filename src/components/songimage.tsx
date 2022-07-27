/* eslint-disable @next/next/no-img-element */
export default function SongImage({
  songName,
  imgUrl,
  spotifyUrl,
  hideText
}: {
  songName: string;
  imgUrl: string;
  spotifyUrl: string;
  hideText?: boolean;
}) {
  return (
    <div className="flex aspect-square h-full flex-row items-center justify-center rounded-l-lg">
      <a target="_blank" rel="noreferrer" className="flex-col rounded-l-xl backdrop-brightness-125 w-5 h-full hover:text-green-200 text-center justify-center items-center" href={spotifyUrl}>
        <img className="w-full aspect-square object-contain" alt="Spotify Logo" src="/spotify.png" />
        <h2 style={{writingMode:"vertical-rl"}} className="flex font-semibold w-full items-center justify-center mt-1 origin-center">{hideText ? "♪" : "Listen"}</h2>
      </a>
      <img className="object-cover h-full aspect-square" alt={songName} src={imgUrl}></img>
    </div>
  );
}
