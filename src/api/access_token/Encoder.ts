import { createHash, HexBase64Latin1Encoding } from 'crypto';
import { v4 as uuid } from 'uuid';

const characterEncoding = 'utf8';

export class Encoder {
    // eslint-disable-next-line
    constructor(
        private readonly shaType: string = 'sha256',
        private readonly baseEncoding: HexBase64Latin1Encoding = 'base64',
    ) {
    }

    public encode(secretKey: string, salt?: string): string {
        const usableSalt = salt !== undefined ? salt : uuid().toString();

        return createHash(this.shaType)
            .update(`${usableSalt}:${secretKey}`, characterEncoding)
            .digest(this.baseEncoding);
    }
}
