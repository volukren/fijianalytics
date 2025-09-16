export default function LogoSVG({ w, h }: { w?: number; h?: number }) {
  const width = w || 24;
  const height = h || 24;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="50" y="175" width="100" height="250" fill="#08D9D6" />
      <rect x="200" y="125" width="100" height="300" fill="#08D9D6" />
      <rect x="350" y="75" width="100" height="350" fill="#08D9D6" />
    </svg>
  );
}
