const restrictedWords = [
    // Add your list of restricted words here
    // These are just examples
    'sexual',
    'explicit',
    'porn',
    'violent',
    'gore',
    'offensive',
    'hate speech',
    'racist',
    'sexist'
  ];
  
  function filterContent(content) {
    const lowerContent = content.toLowerCase();
    
    for (const word of restrictedWords) {
      if (lowerContent.includes(word)) {
        return {
          isAllowed: false,
          filteredContent: {
            reason: `Content contains restricted phrase: ${word}`
          }
        };
      }
    }
    
    return {
      isAllowed: true,
      filteredContent: null
    };
  }
  
  module.exports = {
    filterContent
  };