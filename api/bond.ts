import { Transaction } from "@mysten/sui/transactions";
// import { WalletContextState } from "@suiet/wallet-kit";
import { useCurrentAccount, useSignTransaction } from "@mysten/dapp-kit";

const SUIBOND_PACKAGE_ID =
	"0x0cc4ef678969aba85efd470c5f234ff8801bca8075d9bfe02417d362fc18d393";
const PLATFORM_OBJ_ID =
"0xb50ead4a4ffd1af6e5ea55b0ae5cce18bfd313aefc84c90a14d00f89cc8e168f";

const MODULE = "suibond";

const gasBudgetInMist = 100000000;

export const enter = async () => {
    const { mutate: signAndExecuteTransactionBlock } =
    useSignTransaction();
	const txb = new Transaction();

	txb.setGasBudget(gasBudgetInMist);

	txb.moveCall({
		target: `${SUIBOND_PACKAGE_ID}::${MODULE}::mint_foundation_cap`,
		arguments: [
            txb.pure.string("df")
		],
	});

	try {
		// const res = wallet.signAndExecuteTransaction({
		// 	transaction: txb
		// },
        // {
        //     onSuccess: (res) => {
        //         console.log('executed transaction', res);
        //         setDigest(res.digest);
        //     },
        // }
    // );


    const response = await signAndExecuteTransactionBlock(
        {
          transaction: txb,
        //   options: {
        //     showEffects: true,
        //     showBalanceChanges: true,
        //     showEvents: true,
        //   },
        },
        {
          onSuccess: (result) => {
            console.log(result, "result");

            // if (result) {
            //   if (
            //     result!.effects &&
            //     result.effects.created &&
            //     result.effects.created[0]
            //   ) {
            //     const { reference } = result.effects.created[0];
            //   }
            // }
          },
        }
      );

        
        
		console.log("'enter' transaction result: ", response);
		return response;
	} catch (e) {
		console.error("'enter' transaction failed", e);
	}
};