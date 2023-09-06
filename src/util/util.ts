import { BIL, MIL } from "../constants";

export const formatBil = (cap: string): string => {
    let truncated = parseFloat(cap) / BIL
    return truncated.toFixed(2) + " Billion";
  }
  
  export const formatMil = (supply: string): string => {
    let truncated = parseFloat(supply) / MIL
    return truncated.toFixed(2) + " Million";
  }