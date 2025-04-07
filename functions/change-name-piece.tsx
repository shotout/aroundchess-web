export const changeNamePiece = (piece: string | null) => {
    switch (piece) {
      case "p":
        return "P";
        break;
      case "n":
        return "N";
        break;
      case "b":
        return "B";
        break;

      case "r":
        return "R";
        break;

      case "q":
        return "Q";
        break;

      case "k":
        return "K";
        break;

      default:
        return null;
        break;
    }
  };