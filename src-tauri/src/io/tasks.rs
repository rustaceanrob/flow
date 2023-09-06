use async_hwi::{ledger::{HidApi, Ledger, TransportHID}, HWI};
use bitcoin::bip32::DerivationPath;
use regex::Regex;
use serde::Serialize;
use xyzpub::{convert_version, Version};
use std::{error::Error, fs::File, io::{Read, self, ErrorKind}, collections::HashMap, str::FromStr};
use serde_json::Value;
use turbosql::{Turbosql, select};

use crate::wallet::actions::compute_address;

#[derive(Turbosql, Debug, Default)]
pub struct WalletFile {
    pub rowid: Option<i64>,
    pub name: Option<String>,
    pub bip84: Option<String>,
    pub xfp: Option<String>,
    pub msig: Option<String>,
    pub hmac: Option<[u8; 32]>,
    pub last_change: Option<u32>,
    pub last_receive: Option<u32>,
    pub last_balance: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct WalletContext {
    pub name: String,
    pub xfp: String,
    pub balance: i64,
}

pub async fn import_coldcard_from_json(path: &str) -> Result<(), Box<dyn Error>> {
    let mut file = File::open(path)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    let json_data: Value = serde_json::from_str(&content)?;
    let master_xpub = &json_data["bip84"]["xpub"].to_string();
    let master_fp = &json_data["xfp"].to_string();
    let master_first_addr = &json_data["bip84"]["first"];
    let cleaned_first_addr: String = master_first_addr.to_string().chars().filter(|c| c.is_alphanumeric()).collect();
    let str_xpub: String = master_xpub.chars().filter(|c| c.is_alphanumeric()).collect();
    let test_first_addr = compute_address(str_xpub.as_str(), true, 0)?.to_string();
    assert_eq!(cleaned_first_addr, test_first_addr);
    save_wallet("ColdCard", master_xpub.to_string().replace("\"", ""), master_fp.to_string().replace("\"", ""))?;
    Ok(())
}

pub async fn import_keystone_from_txt(path: &str) -> Result<(), Box<dyn Error>> {
    let mut file = File::open(path)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    let start_index = content.find('[').unwrap() + 1;
    let end_index = content.find('/').unwrap();
    let fp: &str = &content[start_index..end_index];

    let re: Regex = Regex::new(r"zpub[^/]+")?;
    if let Some(capture) = re.find(&content) {
        let extracted_part = capture.as_str();
        let result = convert_version(extracted_part, &Version::Xpub).expect("error converting xpub");
        save_wallet("Keystone", result, fp.to_string())?;
    } else {
        let err = io::Error::new(ErrorKind::Other, "Could not find zpub.");
        return Err(Box::new(err));
    }
    Ok(())
}

pub async fn import_ledger_s() -> Result<(), Box<dyn Error>> {
    let api = HidApi::new().unwrap();
    for detected in Ledger::<TransportHID>::enumerate(&api) {
        if let Ok(device) = Ledger::<TransportHID>::connect(&api, detected) {
            let path = DerivationPath::from_str("m/84h/0h/0h").expect("Bad derivation");
            let xpub = device.get_extended_pubkey(&path).await.expect("Extended Public Key not found");
            let fingerprint = device.get_master_fingerprint().await.expect("Could not get the Fingerprint");
            println!("{:?}", fingerprint);
            let pol = format!("wpkh([{}/84'/0'/0']{}/**)", fingerprint.to_string(), xpub.to_string());
            let hmac = device.register_wallet("Flow", &pol).await.unwrap();
            match hmac {
                Some(hmac) => {
                    save_ledger("Ledger", xpub.to_string(), fingerprint.to_string(), hmac)?;
                },
                None => {
                }
            }
        }
    }
    Ok(())
}

pub async fn import_keystone_from_scan() -> Result<(), Box<dyn Error>> {
    Ok(())
}

fn save_wallet(name: &str, xpub: String, xfp: String) -> Result<(), Box<dyn Error>> {
    WalletFile { name: Some(name.to_string()), bip84: Some(xpub), xfp: Some(xfp.clone().to_uppercase()), ..Default::default() }.insert()?;
    Ok(())
}

fn save_ledger(name: &str, xpub: String, xfp: String, hmac: [u8; 32]) -> Result<(), Box<dyn Error>> {
    WalletFile { name: Some(name.to_string()), bip84: Some(xpub), xfp: Some(xfp.clone().to_uppercase()), hmac: Some(hmac),  ..Default::default() }.insert()?;
    Ok(())
}

pub async fn get_all_wallet_fp() -> Result<Vec<WalletContext>, Box<dyn Error>> {
    let mut wallets = Vec::new();
    let query = select!(Vec<WalletFile>)?;
    for q in query {
        if q.name.is_some() && q.xfp.is_some() && q.last_balance.is_some() {
            wallets.push(WalletContext { name: q.name.unwrap(), xfp: q.xfp.unwrap(), balance: q.last_balance.unwrap() })
        } else if q.xfp.is_some() && q.last_balance.is_some() { // not sure how this could happen
            wallets.push(WalletContext { name: "Unnamed Wallet".to_string(), xfp: q.xfp.unwrap(), balance: q.last_balance.unwrap() })
        } else if q.xfp.is_some() && q.name.is_some() {
            wallets.push(WalletContext { name: q.name.unwrap(), xfp: q.xfp.unwrap(), balance: 0 })
        } else if q.xfp.is_some() {
            wallets.push(WalletContext { name: "Unnamed Wallet".to_string(), xfp: q.xfp.unwrap(), balance: 0 })
        }
    }
    Ok(wallets)
}

pub async fn init_app() -> Result<HashMap<String, String>, Box<dyn Error>> {
    let mut wallets = HashMap::new();
    let query = select!(Vec<WalletFile>)?;
    for q in query {
        if q.bip84.is_some() && q.xfp.is_some() {
            wallets.insert(q.xfp.unwrap(), q.bip84.unwrap());
        } 
    }
    Ok(wallets)
}

pub fn update_wallet(w: WalletFile) -> Result<(), Box<dyn Error>> {
    w.update()?;
    Ok(())
}