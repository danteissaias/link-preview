import { getLinkPreview } from "./src/link-preview";

const tests = [
  "https://www.youtube.com/watch?v=3zgdZZmX7r8",
  "https://www.youtube.com/@ThePrimeTimeagen",
];

for (const query of tests) {
  const preview = await getLinkPreview(query);
  console.log(preview);
}
