import type * as server from '@/server/main';
import { GASClient } from 'gas-client';
import { isGASEnvironment } from 'gas-client/src/utils/is-gas-environment';
export const { serverFunctions } = new GASClient<typeof server>();
export { isGASEnvironment };
