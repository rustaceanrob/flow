// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{sync::{Mutex, Arc}, collections::HashMap, path::PathBuf, fs::File, io::Read};
use bitcoin::psbt::Psbt;
use tauri::State;
use primero::{server::server::{get_balance, UserTransaction, get_fresh, get_all_fee_estimates, update_tx_history_table, return_tx_table}, 
                market::data::{get_mempool_stats, get_mempool_txs, get_nodes_count, get_fiat, get_fiat_history}, 
                io::tasks::{import_coldcard_from_json, import_keystone_from_txt, get_all_wallet_fp, WalletContext, init_app, import_ledger_s, WalletFile, update_wallet}, wallet::actions::make_and_download_transaction,  wallet::actions::{make_and_send, PendingTX, read_psbt_for_confirm, extract_broadcast}};
use turbosql::select;

// wallet context
#[derive(Default)]
pub struct WalletState { 
    pub wallets: Arc<Mutex<HashMap<String, String>>>,
    pub pending_tx: Arc<Mutex<Vec<u8>>>,
}

#[tauri::command]
async fn init(db: State<'_, WalletState>) -> Result<(), String> {
    let map = init_app().await.expect("wallet initalization error");
    db.wallets.lock().expect("").extend(map);
    Ok(())
}

#[tauri::command]
async fn background_tx_refresh(fp: &str, db: State<'_, WalletState>) -> Result<bool, String> {
    let m: HashMap<String, String> = db.wallets.lock().expect("").clone();
    let xpub = m.get(fp).expect("fetch state error at get xpub").as_str();
    let should_refresh = update_tx_history_table(&fp, &xpub, 20).await.expect("could not update history");
    Ok(should_refresh)
}

// core wallet functions

#[tauri::command]
async fn balance(fp: &str, db: State<'_, WalletState>) -> Result<i64, ()> {
    let map = db.wallets.lock().expect("fetch state error at clone").clone();
    let xpub = map.get(fp).expect("fetch state error at get xpub").as_str();
    let balance = get_balance(xpub, 20).await.expect("error fetching balance");
    let mut wallet = select!(WalletFile "WHERE bip84 = " xpub).expect("turbosql fetch wallet error error");
    wallet.last_balance = Some(balance);
    update_wallet(wallet).expect("turbosql update error");
    Ok(balance)
}

#[tauri::command]
async fn history(fp: &str) -> Result<Vec<UserTransaction>, String> {
    let history = return_tx_table(fp).await.expect("could not fetch transaction table");
    Ok(history)
}

#[tauri::command]
async fn fresh_address(fp: &str, db: State<'_, WalletState>) -> Result<String, String> {
    let map = db.wallets.lock().expect("fetch state error at clone").clone();
    let xpub = map.get(fp).expect("fetch state error at get xpub").as_str();
    let address = get_fresh(xpub).await.expect("error fetching address");
    let str_repr = address.to_string();
    Ok(str_repr)
}

#[tauri::command]
async fn wallet_fp_context() -> Result<Vec<WalletContext>, String> {
    let wallets = get_all_wallet_fp().await.expect("error occured fetching wallet context");
    Ok(wallets)
}

#[tauri::command]
async fn make_download(fp: &str, receive_addr: String, target: u64, clean_wallet: bool, block_target: usize, db: State<'_, WalletState>) -> Result<(), String> {
    let map = db.wallets.lock().expect("fetch state error at clone").clone();
    let xpub = map.get(fp).expect("fetch state error at get xpub").as_str();
    let _ = make_and_download_transaction(target, xpub, fp, receive_addr.as_str(), block_target, clean_wallet).await.expect("some error occured in transcation");
    Ok(())
}

#[tauri::command]
async fn make_send(fp: &str, receive_addr: String, target: u64, clean_wallet: bool, block_target: usize, db: State<'_, WalletState>) -> Result<(), String> {
    let map = db.wallets.lock().expect("fetch state error at clone").clone();
    let xpub = map.get(fp).expect("fetch state error at get xpub").as_str();
    let _ = make_and_send(target, xpub, fp, receive_addr.as_str(), block_target, clean_wallet).await.expect("some error occured in transcation");
    Ok(())
}

#[tauri::command]
async fn set_binary(file: PathBuf, db: State<'_, WalletState>) -> Result<PendingTX, String> {
    let mut file = File::open(file).expect("Could not find that PSBT");
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).expect("Error reading that PSBT");
    let psbt = Psbt::deserialize(&buffer).expect("Error deserializing that PSBT");
    let pending = read_psbt_for_confirm(psbt).expect("error getting psbt info");
    db.pending_tx.lock().expect("").extend(&buffer);
    Ok(pending)
}

#[tauri::command]
async fn send_from_binary(db: State<'_, WalletState>) -> Result<(), String> {
    let buffer = db.pending_tx.lock().expect("").clone();
    let psbt = Psbt::deserialize(&buffer).expect("Error deserializing that PSBT");
    let _ = extract_broadcast(psbt).await.expect("an error occured broadcasting the transaction binary.");
    Ok(())
}

// io

#[tauri::command]
async fn read_coldcard(path: &str) -> Result<(), ()> {
    import_coldcard_from_json(path).await.expect("error occured saving coldcard wallet data");
    Ok(())
}

#[tauri::command]
async fn read_keystone_txt(path: &str) -> Result<(), ()> {
    import_keystone_from_txt(path).await.expect("error occured saving keystone wallet data");
    Ok(())
}

#[tauri::command]
async fn read_ledger() -> Result<(), ()> {
    import_ledger_s().await.expect("error occured saving ledger wallet data");
    Ok(())
}

// stats and fiat info

#[tauri::command]
async fn get_all_fees() -> Result<Vec<f64>, ()> {
    let fees = get_all_fee_estimates().await.expect("error fetching mempool stats");
    Ok(fees)
}

#[tauri::command]
async fn mempool_stats() -> Result<String, ()> {
    let mempool_stats = get_mempool_stats().await.expect("error fetching mempool stats");
    Ok(mempool_stats)
}

#[tauri::command]
async fn mempool_txs() -> Result<String, ()> {
    let mempool_txs = get_mempool_txs().await.expect("error fetching mempool txs");
    Ok(mempool_txs)
}

#[tauri::command]
async fn node_count() -> Result<String, ()> {
    let nodes = get_nodes_count().await.expect("error fetching node count");
    Ok(nodes)
}

#[tauri::command]
async fn fiat_rate() -> Result<String, ()> {
    let fiat = get_fiat().await.expect("error fetching fiat");
    Ok(fiat)
}

#[tauri::command]
async fn fiat_history() -> Result<String, ()> {
    let fiat = get_fiat_history().await.expect("error fetching fiat");
    Ok(fiat)
}

fn main() {
    tauri::Builder::default()
        .manage(WalletState { ..Default::default() })
        .invoke_handler(tauri::generate_handler![balance, history, init,
                                                background_tx_refresh, make_download,
                                                make_send, set_binary, send_from_binary,
                                                fresh_address, wallet_fp_context,
                                                read_coldcard, read_keystone_txt, 
                                                read_ledger,
                                                mempool_stats, get_all_fees,
                                                mempool_txs, node_count, 
                                                fiat_rate, fiat_history])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
