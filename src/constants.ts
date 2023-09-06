import Device from "./interfaces/Device"
import { DeviceEnum } from "./interfaces/DeviceEnum"
import { PsbtStyle } from "./interfaces/PsbtStyle"

export const PRIMARY_HEXODE: string = "#3b82f6"
export const SECONDARY_HEXCODE: string = "#18181b"
export const COMPLIMENT_HEXCODE: string = "#71717a"
export const TRANSITION: string = "transition-all ease-in-out duration-500"

export const MIL: number = 1e6
export const BIL: number = 1e9
export const TO_BTC: number = 0.00000001
export const MAX_RECEIVE: number = 10000000000
export const FLOOR_MAGIC: number = 100000000

export const MK4_IMPORT_STEPS: string[] = ["Insert a MicroSD card into your ColdCard and power it on with a power-only cord.", 
                                            "Log-in to your device and navigate to Advanced/Tools in the main menu.", 
                                            "Navigate to Export Wallet.", 
                                            "Select Generic JSON", "Choose an account number. Normally 0 is sufficient.", 
                                            "Wait for the ColdCard to write the JSON file to the MicroSD.", "Securely Logout and Power Down.", 
                                            "Finally, take the MicroSD card out of the ColdCard and plug it into this computer.", 
                                            "Click the import button below and select the 'coldcard-export.json' file from your MircoSD card."]

export const KEYSTONE_TXT_IMPORT_STEPS: string[] = ["Insert a MicroSD card into your Keystone and power it on.", 
                                                    "Enter your password.",
                                                    "Press the 3 dots in the top right corner of the screen to open the settings.",
                                                    "Select Export Wallet", "Select the option to save the wallet information as a file."
                                                ]
                                            
export const LEDGER_S_IMPORT_STEPS: string[] = ["Plug your Ledger into this computer.", 
                                                "Enter your pin.",
                                                "Select the Bitcoin app.",
                                                "Press the button on the screen below.",
                                                "Follow the instructions on your Ledger.",
                                            ]

export const DEVICES: Device[] = [{ name: "ColdCard MK4", device: DeviceEnum.COLDCARD, psbtStyle: PsbtStyle.FILE }, 
                                  { name: "Ledger Nano S", device: DeviceEnum.LEDGER, psbtStyle: PsbtStyle.QR },
                                  { name: "Keystone", device: DeviceEnum.KEYSTONE, psbtStyle: PsbtStyle.CONNECTED }]