function mulberry32(seed, index) {
  let t = (seed + index * 0x6D2B79F5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const stats = Array(406).fill(0);

for (let i = 0; i < 100000; i++) {
  const res = Math.floor(mulberry32(68462987, i) * 406);
  stats[res]++;
}

//print the stats
for (let i = 0; i < stats.length; i++) {
  console.log(`Index ${i}: ${stats[i]}`);
}