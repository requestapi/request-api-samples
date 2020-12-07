import { inspect } from 'util';
import { config } from 'dotenv';
import {
    getAccessToken as getAccessTokenRaw,
    IAccessToken,
    IAccessTokenRequestOptions,
} from './api/access_token';

export const authenticate: () => Promise<IAccessToken> = async () => {
    config();
    const requestAccessTokenOptions: IAccessTokenRequestOptions = {
        unencryptedSecretKey: process.env.UNENCRYPTED_SECRET_KEY,
        salt: process.env.SALT,
        thirdPartyAccessId: process.env.THIRD_PARTY_ACCESS_ID,
    };

    const accessToken = await getAccessTokenRaw(requestAccessTokenOptions);
    if (isMainProcess()) {
        console.log(inspect(accessToken, { colors: true, depth: undefined }));
    }

    return accessToken;
};

export async function getBasicOptions() {
    return {
        accessToken: await getAccessToken(),
        thirdPartyAccessId: process.env.THIRD_PARTY_ACCESS_ID,
        requestId: process.env.REQUEST_ID,
        deviceId: process.env.DEVICE_ID,
        apiRegistrationId: process.env.API_REGISTRATION_ID,
        applicationId: process.env.APPLICATION_ID,
        body: undefined,
    };
}

export async function getAccessToken(): Promise<string> {
    const accessToken = process.env.ACCESS_TOKEN;
    // eslint-disable-next-line
    if (accessToken === undefined || accessToken === null) {
        return (await authenticate()).access_token;
    }

    return accessToken;
}

if (isMainProcess()) {
    void authenticate();
}

function isMainProcess() {
    return require.main === module;
}
