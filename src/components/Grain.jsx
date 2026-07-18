// A whisper-quiet film grain over the whole page. Breaks up the flat dark fields the way
// premium dark UIs do. The noise is a pre-rasterized tiled image (see .grain in global.css),
// so it composites as cheaply as any background image — no per-frame filter cost.
export default function Grain() {
  return <div aria-hidden="true" className="grain" />;
}
