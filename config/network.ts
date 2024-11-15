import { getFullnodeUrl } from "@mysten/sui/client";
import { SUIBOND_PACKAGE_ID, PLATFORM_OBJ_ID } from "@/config/constants";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig ({
    testnet:{
        url: getFullnodeUrl("testnet"),
        contracts: {
            suibond: SUIBOND_PACKAGE_ID,
            platform: PLATFORM_OBJ_ID,
        },
    }
});

export { networkConfig, useNetworkVariable, useNetworkVariables };