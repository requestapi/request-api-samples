import * as rp from 'request-promise';
import { Encoder } from './Encoder';
import { IAccessToken } from './IAccessToken';
import { IAccessTokenRequestOptions } from './IAccessTokenRequestOptions';

const BASE_URI = 'https://gateway-web.beta.interac.ca/publicapi/api/v1/access-tokens';

const encoder = new Encoder();

export async function getAccessToken(
    options: IAccessTokenRequestOptions,
): Promise<IAccessToken> {
    try {

        const { unencryptedSecretKey, salt, thirdPartyAccessId } = options;

        return await rp({
            uri: BASE_URI,
            headers: {
                secretKey: encoder.encode(unencryptedSecretKey, salt),
                salt,
                thirdPartyAccessId,
            },
            json: true,
        })  as IAccessToken;
    } catch (error) {
        const respErr  = error;
        if (respErr.statusCode === '401'){
            console.log(`HTTP Status Code: ${  respErr.statusCode}`);
            console.log('Access Token request failure. Verify .env details are correct');


        } else {
            console.log(`HTTP Status Code: ${  respErr.statusCode}`);

        }

        return respErr.message;
    }
}
