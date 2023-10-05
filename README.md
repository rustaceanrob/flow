### Flow Bitcoin Wallet

I began this project before finding a load of Bitcoin related crates written in Rust, namely `bdk`. I plan to refactor this project using `bdk` and integrating with more hardware wallets. For now, this code serves as a personal reference and proof of knowledge. The wallet was designed to:

- Store any number of hardware wallet details (fingerprint, xpub)
- Cache and fetch the most recently (un)used change and recieve addresses
- Cache and fetch a transaction history
- Generate and download partially signed bitcoin transactions (PSBT) by file 
- Broadcast a signed PSBT to the network with an Electrum server
- Fetch mempool and fiat price data

### Screenshots

<img width="1195" alt="Screenshot 2023-10-05 at 7 26 07 AM" src="https://github.com/rustaceanrob/flow/assets/102320249/088b7c0e-2321-4880-8df1-39a699d7879f">
<img width="1015" alt="Screenshot 2023-10-05 at 7 26 53 AM" src="https://github.com/rustaceanrob/flow/assets/102320249/b138ecd1-1575-4f57-a119-e0aea0648087">
<img width="1196" alt="Screenshot 2023-10-05 at 7 24 49 AM" src="https://github.com/rustaceanrob/flow/assets/102320249/0f255fab-9f1f-48f2-83fa-b0e72955a84b">
<img width="1012" alt="Screenshot 2023-10-05 at 7 27 22 AM" src="https://github.com/rustaceanrob/flow/assets/102320249/d37832ca-2e25-4644-82a7-7e3463e1f86d">
<img width="1011" alt="Screenshot 2023-10-05 at 7 28 04 AM" src="https://github.com/rustaceanrob/flow/assets/102320249/f866fb48-b754-4f40-80c4-9e04c970b1d1">
<img width="1198" alt="Screenshot 2023-10-05 at 7 25 13 AM" src="https://github.com/rustaceanrob/flow/assets/102320249/e7aaea11-315b-4d3c-9440-eab09c757404">
