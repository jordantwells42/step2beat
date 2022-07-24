export default function speedToTempo(speed: {speed: number, walking: boolean}){
    if (speed.walking) {
        return Math.round(speed.speed * 24.33 + 45.82);
      } else {
        return Math.round(speed.speed * 10.62 + 87.979)
      }
}