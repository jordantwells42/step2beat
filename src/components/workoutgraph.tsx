import * as d3 from "d3";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { motion } from "framer-motion";
import speedToTempo from "../libs/speedToTempo";

function clamp(x:number, min:number, max:number){
  return Math.round(Math.min(Math.max(x, min), max) * 20) / 20;
}

export default function WorkoutGraph({
  speeds,
  setSpeeds,
  width,
  height,
}: {
  speeds: {
    speed: number;
    walking: boolean;
  }[];
  setSpeeds: Dispatch<
    SetStateAction<
      {
        speed: number;
        walking: boolean;
      }[]
    >
  >;
  width: number;
  height: number;
}) {
  let margin = {
    top: 60,
    right: 40,
    bottom: 20,
    left: 40,
  };
  const justSpeeds = speeds.map((s) => s.speed);
  const data: [number, number][] = speeds.map((s, idx) => [idx, s.speed]);
  const [dragging, setDragging] = useState(false);
  let xScale = d3
    .scaleTime()
    .domain([0, speeds.length - 1])
    .range([margin.left, width - margin.right]);

  let yScale = d3
    .scaleLinear()
    .domain([0, Math.min(Math.max(...justSpeeds)+1, 15)])
    .range([height - margin.bottom, margin.top]);

  let line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveNatural);

  let d = line(data);

  return (
    <div className="relative">
      <svg className="text-aluminium-300 " viewBox={`0 0 ${width} ${height}`}>
        {/* X axis */}
        {data.map((datum, idx) => (
          <g key={idx} className="">
            {/*i % 2 === 1 && (
                <rect
                  width={xScale(endOfMonth(month)) - xScale(month)}
                  height={height - margin.bottom}
                  fill="currentColor"
                  className="text-gray-100"
                />
              )*/}
            <text
              x={xScale(idx)}
              y={height - 5}
              textAnchor="middle"
              fill="currentColor"
              className="text-[10px] text-aluminium-900"
            >
              {idx}
            </text>
          </g>
        ))}

        {/* Y axis */}
        {yScale.ticks(5).map((max) => (
          <g transform={`translate(0,${yScale(max)})`} className="" key={max}>
            <line
              x1={margin.left}
              x2={width - margin.right}
              stroke="currentColor"
              strokeDasharray="1,3"
            />
            <text
              alignmentBaseline="middle"
              className="text-[10px] text-aluminium-900"
              fill="currentColor"
            >
              {max}
            </text>
          </g>
        ))}

        {/* Line */}
        {d && (
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        )}
      </svg>
      {/* Circles */}
      <div className="absolute top-0 h-full w-full">
        {speeds.map((speed, idx) => (
          <div
            className="absolute"
            style={{
              transform: `translate(${xScale(idx) - 6}px, ${
                yScale(speed.speed) - 6
              }px)`,
            }}
            key={idx}
          >
            <motion.div
              draggable="true"
              initial={{ rotateZ: 0 }}
              animate={{ rotateY: speed.walking ? 0 : 180 }}
              className={`h-3 w-3 cursor-pointer rounded-full touch-none ${
                speed.walking ? "bg-aluminium-700" : "bg-spotify-700"
              } hover:cursor-pointer`}
              onClick={() => {
                setSpeeds((prev) =>
                  prev.map((s, i) =>
                    i === idx ? { ...s, walking: !s.walking } : s
                  )
                );
              }}
              onTouchStart={(e) => {
                setDragging(true);
              }}
              onTouchMove={(e: any) => {
                var bcr = e.target.getBoundingClientRect();
                var x = e.targetTouches[0].clientX - bcr.x;
                var y = e.targetTouches[0].clientY - bcr.y;
                if (Math.abs(y) > 200) {
                  return;
                }
                setSpeeds((prev) =>
                  prev.map((s: any, i: number) => {
                    if (i === idx) {
                      return {
                        ...s,
                        speed: clamp(s.speed - y/height*(Math.min(Math.max(...justSpeeds)+1, 15)), 0, 15)
                      };
                    }
                    return s;
                  })
                );
              }}
              onTouchEnd={(e) => {
                setDragging(false);
              }}
              onDragStart={(e) => {
                setDragging(true);
              }}
              onDrag={(e: any) => {
                console.log(e);
                e.preventDefault()
                var y = e.nativeEvent.offsetY;
                if (Math.abs(y) > 200) {
                  return;
                }
                setSpeeds((prev) =>
                  prev.map((s: any, i: number) => {
                    if (i === idx) {
                      return {
                        ...s,
                        speed: clamp(s.speed - y/height*(Math.min(Math.max(...justSpeeds)+1, 15)), 0, 15)
                      };
                    }
                    return s;
                  })
                );
              }}
              onDragEnd={(e) => {
                e.preventDefault();
                setDragging(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: dragging ? 1 : 0 }}
              className="-translate-y-12 -translate-x-4 text-xs font-semibold text-aluminium-800"
            >
              <h1>{speed.speed} mph</h1>
              <h1>{speedToTempo(speed)} BPM</h1>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="absolute -top-16 right-0 flex flex-row-reverse gap-2">
        <button
          className="flex aspect-square w-8 items-center justify-center rounded-full bg-aluminium-800 text-white"
          onClick={() =>
            setSpeeds((p: any) => [
              ...p,
              p.at(-1) || { speed: 3, walking: false },
            ])
          }
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <button
          className="flex aspect-square w-8 items-center justify-center rounded-full bg-aluminium-800 text-white"
          onClick={() => setSpeeds((p: any) => [...p.slice(0, -1)])}
        >
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
      </div>
      <div className="absolute top-0 right-0 flex flex-row items-cener justify-center gap-4">
        <h1 className="flex flex-row h-3 items-center justify-center gap-2 text-aluminium-500">
          Tap to change...
        </h1>
        <div className="flex flex-row h-3 items-center justify-center gap-2">
          <div className="w-3 aspect-square rounded-full bg-spotify-700"></div>
          <h1>Running</h1>
        </div>
        <div className="flex flex-row h-3 items-center justify-center gap-2">
          <div className="w-3 aspect-square rounded-full bg-aluminium-700"></div>
          <h1>Walking</h1>
        </div>
      </div>
    </div>
  );
}
