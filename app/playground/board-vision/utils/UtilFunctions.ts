export function shuffle<T>(array: T[]): T[] {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  export function uniques<T>(arr: T[]): T[] {
    return arr.filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });
  }