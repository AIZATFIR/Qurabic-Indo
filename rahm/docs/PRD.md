# PRD: Project Rahm (رَحْم) — Spiritual Guidance & Alignment Engine for Ummat Islam

## 1. Executive Summary & Vision
**Rahm** (رَحْم — Divine Womb of Mercy, Grace, and Inner Regeneration) is an advanced spiritual operating framework and guided experience built within the Qurabic ecosystem. 

Its mission is to guide Muslims from ego-driven fragmentation (*Nafs Ammarah / Not-Self*) to unified peace and spiritual mastery (*Nafs Mutma'innah & Kamilah / Divine Alignment*), synthesizing:
1. **Classical Islamic Metaphysics & Sufi Psychology**:
   - Muhyiddin Ibn 'Arabi's *Risalat al-Anwar* (*Journey to the Lord of Power*): The 6 Realms (*Mawatin*), the spiritual retreat (*Khalwa*), Dhikr of the Divine Names (*Asmaul Husna*), and the cycle of *Fana'* (ego dissolution) to *Baqa'* and *Mardudun* (returning to serve creation).
   - Tazkiyatun Nafs: 7 Evolutionary Stages of the Soul (Ammarah, Lawwamah, Mulhamah, Mutma'innah, Radhiyah, Mardhiyah, Kamilah).
2. **Modern Contemplative Alignment & Quantum Human Mechanics**:
   - Synthesizing concepts from Richard Rudd (Gene Keys / Spectrum of Consciousness: Shadow -> Gift -> Siddhi), Jakal El-Malik (D.O.S. / Destroying Ego-Self, Alignment with Supreme Source, Co-Creation Mode), and Jim Francis (Mind Power, Subconscious Reprogramming, Breath Energy / Nafas Rohani, and Synchronicity Recognition).
3. **Qurabic Core Integration**:
   - Seamless bidirectional linking with Qurabic's Quranic Arabic Corpus, classical lexicons (Lane's Lexicon, Lisan al-Arab, Raghib al-Isfahani), word-by-word morphology, and multi-qari audio recitation.
4. **Apple Fluid Design System**:
   - Built to Apple's highest WWDC design standards: zero-latency touch responses (`pointerdown`), interruptible spring animations, translucent materials (`backdrop-blur-xl`), and spatial restraint.

---

## 2. Core Pillars & Architecture

```
+-----------------------------------------------------------------------------------+
|                                  PROJECT RAHM                                     |
|                       (Islamic Spiritual Guidance Engine)                         |
+-----------------------------------------------------------------------------------+
|  1. RAHM LAUNCHER (Cmd+K)     |  2. FOCUS CLOCK (Muraqabah) | 3. SADAR (Awakening)|
|  Instant Control Center       |  Khusyu', Sholat, Breathing | Nafs & Spectrum Map |
|  - Jump to Surah / Ayat       |  - Apple Spring Timer       | - Shadow -> Hikmah  |
|  - Muraqabah & Focus Launcher |  - Nafas Rohani (In/Hold/Ex)| - Divine Name Remedy|
|  - Asmaul Husna & Hadith      |  - Ambient Dhikr & Bell     | - Daily Muhasabah   |
+-------------------------------+-----------------------------+---------------------+
|                     4. SPIRITUAL FRAMEWORK (Metaphysics & Nafs)                   |
|  - 7 Stages of the Nafs (Ammarah -> Kamilah)                                      |
|  - 6 Mawatin (Realms of Being: Mithaq, Dunya, Barzakh, Qiyamah, Jannah, Kathib)   |
|  - 64 Spiritual Frequencies (Shadow / Gift / Siddhi mapped to Quranic Tadabbur)   |
+-----------------------------------------------------------------------------------+
|                     5. MULTI-SOURCE API EXPANSION LAYER                           |
|  - Hadith Data Client (Bukhari, Muslim, Nawawi)                                   |
|  - Asmaul Husna 99 Names Engine (Roots, Semantic Attributes, Dhikr Prescription)  |
|  - AlAdhan Prayer Times & Hijri Calendar Engine                                   |
|  - Qurabic Corpus & Word-by-Word Bridge                                           |
+-----------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Specifications

### 3.1 Rahm Launcher (`rahm/components/RahmLauncher.tsx`)
- **Trigger**: Global hotkey (`Cmd+K` / `Ctrl+K`), floating bottom/nav launcher button.
- **Design Philosophy**: Apple macOS Spotlight / Raycast. Floating modal with `backdrop-blur-2xl bg-white/85 dark:bg-black/85`, subtle hairline borders, and zero-latency keyboard arrow navigation.
- **Command Categories**:
  - `Quran & Tadabbur`: Jump directly to Surah, Ayat, or Akar Kata.
  - `Muraqabah & Focus`: Start 5m, 15m, 25m focus clock sessions.
  - `Sadar & Muhasabah`: Open spiritual reflection check-in.
  - `Asmaul Husna`: Explore 99 Divine Names and their contemplative keys.
  - `Hadith Harian`: View curated prophetic wisdom.
  - `Jadwal Sholat`: Check prayer countdown and hijri date.

### 3.2 Focus Clock (`rahm/components/FocusClock.tsx`)
- **Purpose**: Facilitating *Muraqabah* (contemplative presence), *Khusyu'* in worship, and deep focus without worldly distractions (*Al-Khalwa fil-Jalwa*).
- **Features**:
  - **Apple-inspired Fluid Wheel**: Spring-animated circular progress, smooth dragging to set duration.
  - **Nafas Rohani Breathing Guide**: Visual expandable circle with rhythmic breathing cadence (e.g. 4s Inhale, 4s Hold, 4s Exhale / *Tanafus bil-Haqq*).
  - **Dhikr Counter & Pacer**: Optional subtle tactile pulse every dhikr repetition.
  - **Audio Ambience**: Subtle natural white noise or soft water/wind tones.

### 3.3 Sadar Module (`rahm/components/SadarModule.tsx`)
- **Purpose**: Real-time consciousness evaluation (*Muhasabah*) based on the 7 Stages of the Nafs and the Spectrum of Consciousness.
- **Features**:
  - **State Calibration**: User selects or searches their current feeling/obstacle (e.g. Cemas, Ragu, Marah, Hasad, Kehilangan Arah).
  - **Transmutation Path**: Displays the transmuted quality:
    - *Shadow (Not-Self)* -> *Hikmah (Gift)* -> *Nur (Divine Siddhi)*.
  - **Prescribed Cure (*Ilaj As-Salik*)**:
    - Relevant Quranic Ayah with translation.
    - Matching Asmaul Husna invocation (e.g. *Ya Salam*, *Ya Hadi*, *Ya Fattah*).
    - Authentic Hadith on cultivating the corresponding virtue.

---

## 4. Multi-Source API Expansion Architecture (`rahm/lib/api-expansion.ts`)
1. **Asmaul Husna Engine**:
   - Complete 99 Names database with root extraction, semantic attributes, benefits in dhikr, and Quranic locus.
2. **Hadith Integration**:
   - Fast client with built-in caching for authentic collections (Sahih Bukhari, Sahih Muslim, Riyadhus Shalihin, Arba'in Nawawiyyah).
3. **AlAdhan Prayer Times & Hijri API**:
   - Real-time prayer calculation (Fajr, Dhuhr, Asr, Maghrib, Isha) using precise coordinates with edge caching.
4. **Qurabic Corpus Linkage**:
   - Integration with `fetchSurahWithWBW` and `WordStudy` to ground every spiritual guidance in authoritative Quranic text.

---

## 5. Sub-Agent Execution Loop
Sub-agents interacting with this project should follow `rahm/docs/AGENT_LOOP.md` for deterministic delivery, test-driven validation, and clean Git commits.
