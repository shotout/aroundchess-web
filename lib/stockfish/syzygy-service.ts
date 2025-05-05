import axios, { AxiosResponse } from 'axios';

class SyzygyService {
    public get(fen: string): Promise<AxiosResponse> {
        return axios.get(`https://tablebase.lichess.ovh/standard?fen=${fen}`, {
            timeout: 2000,
            headers: {
                'Cache-Control': 'force-cache',
                'Accept': 'application/json'
            }
        });
    }
}

export const syzygyService = new SyzygyService();
