export const fetchChessData = async (username: string, endpoint: string) => {
    const url = `${process.env.CHESS_API_URL}${username}/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': ' aroundchess/1.0',
          'Accept': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data from Chess.com. Status: ${response.status}`);
      }
  
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }
  