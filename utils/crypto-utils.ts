import { createHash } from 'crypto';

export function createPgnHash(pgn: string): string {
    return createHash('sha256').update(pgn).digest('hex');
}
