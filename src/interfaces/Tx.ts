export default interface Tx {
    value: number,
    height: number,
    was_sent: boolean,
    confirmed: boolean,
}