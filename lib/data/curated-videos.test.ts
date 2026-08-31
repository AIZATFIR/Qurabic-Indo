import { CURATED_VIDEOS, VIDEO_CATEGORIES } from './curated-videos';
import { RECOMMENDED_APPS } from './recommended-apps';

console.log('🧪 Running Curated Videos & Recommended Apps Unit Tests...');

// Test 1: Verify curated videos exist and have valid YouTube IDs
if (CURATED_VIDEOS.length < 4) {
  throw new Error(`Expected at least 4 curated videos but found ${CURATED_VIDEOS.length}`);
}

const expectedIds = ['HKjUgJD0Tw4', 'zoF4A5l9Eyg', 'HF9asWpE5AU', 'jmNY06nmpL8'];
for (const id of expectedIds) {
  const found = CURATED_VIDEOS.find((v) => v.youtubeId === id);
  if (!found) {
    throw new Error(`Expected YouTube video ID ${id} in curated videos`);
  }
  if (!found.title || !found.speaker || !found.linguisticTakeaway) {
    throw new Error(`Video ${id} missing required metadata`);
  }
  console.log(`✅ Test passed for video [${id}]: ${found.title} (${found.speaker})`);
}

// Test 2: Verify Kalaam App exists in RECOMMENDED_APPS
const kalaam = RECOMMENDED_APPS.find((a) => a.id === 'kalaam-app');
if (!kalaam || !kalaam.appUrl.includes('kalaamapp.com')) {
  throw new Error('Kalaam App missing or invalid in RECOMMENDED_APPS');
}
console.log(`✅ Test passed: Kalaam App configured with ${kalaam.highlights.length} highlights and rating ${kalaam.rating}`);

console.log('🎉 ALL CURATED LEARNING SHOWCASE TESTS PASSED SUCCESSFULLY!');
