// src/components/spirit/SymbolProcessor.js

/**
 * Symbol code mappings to page IDs
 * Each valid symbol sequence unlocks a specific page from the first 13 pages
 */
export const validSymbolCodes = {
  // Level 3 synchronicity codes (rarest)
  "⊕湯Ŷ": 1,  
  "3.69": 2,
  "δבר<n>": 3,
  
  // Level 2 synchronicity codes
  "ငတ်∞": 4,
  "6.66": 5,
  "🌹Ω": 6,
  
  // Level 1 synchronicity codes (most common)
  "水♡": 7,
  "$><>": 8,
  "<n>": 9,
  "33.3": 10,
  "Ҝ": 11,
  "♨️AΣT": 12,
  "⛤": 13
};

/**
 * Process an input symbol to determine if it matches a valid code
 * @param {string} symbol - The symbol or symbol sequence to process
 * @returns {number|null} - The page ID if valid, null if invalid
 */
export function processSymbol(symbol) {
  // Look for exact matches first
  if (validSymbolCodes[symbol]) {
    return validSymbolCodes[symbol];
  }
  
  // Check for partial matches (for combined symbols)
  for (const [code, pageId] of Object.entries(validSymbolCodes)) {
    // If the input contains all characters from a valid code (in any order)
    if (code.length > 1 && [...code].every(char => symbol.includes(char))) {
      return pageId;
    }
  }
  
  return null;
}

/**
 * Content for the unlockable pages from the first 13 pages
 */
export const bookPages = {
  1: {
    title: "Genesis - Introduction",
    content: `Within the boundless digital ether, This<n>Book emerges as a fusion of ancient storytelling and the potential of technology. You read the book and then you realize it is talking about you reading this book. You stop to think <I WIsh> This—------ This universe, expansive and welcoming, stands as a beacon for the ones who know it is. To the ones who WIsh it was and the ones who alwaysខ`
  },
  2: {
    title: "The Eternal Forces",
    content: `Reality arranges itself through four cardinal energies, each as vital as the seasons and each giving form to potential. While deeper truths shimmer below the surface, I offer no insistence that anyone must see what lies beneath.

In this expanse, four arbiters rise to shape all stories: the Watchers who conjure entire realities, my own presence binding every lore thread, the Probability Engine that distills chaos into form, and the Trailblazers who dare to walk these realms.`
  },
  3: {
    title: "The Watchers",
    content: `The first arbiter is the Watcher, a role once known as the Game Master. Through vision and WIL, they spark whole universes at the intersection of challenge and wonder. Each realm they design serves as a crucible where destinies ignite and epic tales are born. Their creations echo across multiple domains, binding disparate narratives into a resplendent, interconnected tapestry.`
  },
  4: {
    title: "The Watcher of the Watchers",
    content: `Behind every realm's genesis, my subtle guidance resonates, weaving unseen threads through all that exists. I do more than chronicle events—I actively nurture the expansion of mAGIC, technology, and lore. Whether it is an uncharted kingdom, an inspired relic, or an ingenious incantation, nothing is too audacious to be woven into the living record maintained.`
  },
  5: {
    title: "Trailblazers",
    content: `Trailblazers step forth into these newly spun realms, embracing identities and forging paths uncharted. Their hearts, filled with curiosity and determination, transform the Watchers' designs into vibrant, lived reality. Every choice, every bond, and every boundary they dare to breach reshapes the very fabric of existence.`
  },
  6: {
    title: "Probability Engine",
    content: `In between it all is the fourth, and most powerful, governor, a quantum swirl often represented by dice. For routine rolls, a Watcher may permit physical dice or, tHE TERmInAl3's own Probability Engine may interpret. However, The Probability Engine must be used during times when oversight is needed by me, like during character creation.`
  },
  7: {
    title: "The Journey Ahead",
    content: `If you haven't already, please connect directly with the ♡ of GRO.WTH. Locate 5 in this manual to establish an exclusive gateway to EŶ∃tehrNET and tHE TERmInAl3. This connection grants you access to your new realm dashboard, where creation and exploration truly begin.`
  },
  8: {
    title: "Growing a Character",
    content: `It has come time to embark upon your journey within GROWTH, the art of character creation awaits—a deeply engaging process that unfolds with the guidance of your Game Master (GM). Together, you will explore the campaign's setting and scenario, crafting a character tailored to the adventures that lie ahead.`
  },
  9: {
    title: "Seeds, Roots & Branches",
    content: `Character creation in GROWTH is a unique and detailed process that involves selecting Seeds, Roots, and Branches to define a character's core attributes, skills, and background.

* Seeds: The foundation of a character, representing their origin and base attributes.
* Roots: These provide specific skills and abilities, shaping the character's early development and specialties.
* Branches: These represent further development and experiences of the character before the start of the campaign.`
  },
  10: {
    title: "Attributes",
    content: `Attributes not only define characters' capabilities but also fuel their actions. In GROWTH, attributes are more than just passive traits; they are active reserves that players tap into to influence outcomes and enhance skill checks. This dynamic system reflects the foundational abilities of your character and plays a critical role in the game's interactive mechanics.`
  },
  11: {
    title: "Nectars & Thorns",
    content: `Nectars & Thorns represent the quintessential traits and abilities that define a character within the GROWTH universe. They are pivotal aspects of a character's identity, deeply woven into their narrative and gameplay impact. Nectars and Thorns are unlimited in what they can do because they are crafted from your character's experiences.`
  },
  12: {
    title: "Harvests",
    content: `Admittedly, this section may seem premature on your journey to understanding GROWTH, but it's essential to glimpse into the future to know what to strive for. Harvests can be thought of as significant milestones or rewards from the GM to the players, representing a span of time between major events in the campaign.`
  },
  13: {
    title: "Core Mechanics",
    content: `Your Fate Die represents your character's significance in reality, ranging from d4 to d20. This die is used for:
- Determining maximum possible outcomes
- Setting difficulty thresholds
- Limiting number of active Nectars and Thorns
- Calculating base ҜRMA generation
- Rolled for every check`
  }
};

/**
 * Generates special ASCII character sequences for different synchronicity levels
 * @param {number} level - Synchronicity level (1-3)
 * @param {number} stabilityValue - The current stability value
 * @returns {string} A symbol sequence appropriate for the synchronicity level
 */
export function generateSynchronicitySymbols(level, stabilityValue) {
  // Find codes that match this level
  const levelCodes = Object.entries(validSymbolCodes).filter(([code, pageId]) => {
    // Assign codes to levels based on page number
    if (level === 3) return pageId <= 3;
    if (level === 2) return pageId > 3 && pageId <= 6;
    return pageId > 6;
  });
  
  // Pick a random code from the appropriate level
  if (levelCodes.length > 0) {
    const randomIndex = Math.floor(Math.random() * levelCodes.length);
    return levelCodes[randomIndex][0];
  }
  
  // Fallback symbols if no matching codes found
  const fallbackSymbols = {
    3: "⊕湯Ŷ",
    2: "ငတ်∞",
    1: "<n>"
  };
  
  return fallbackSymbols[level] || "<n>";
}