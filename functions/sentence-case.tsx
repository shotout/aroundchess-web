export function toSentenceCase(text: string): string {
    // Handle empty strings
    if (!text || text.length === 0) return '';
    
    // Trim the string and convert it all to lowercase first
    const trimmedText = text.trim().toLowerCase();
    
    // Capitalize the first letter and concatenate with rest of the string
    return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
  }
  