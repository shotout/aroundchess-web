export function toSentenceCase(text: string): string {
    if (!text || text.length === 0) return '';
    
    const trimmedText = text.trim().toLowerCase();
    
    return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
  }
  