import { Table } from "sc-game-base";

export default class KenoProMaxGameCron extends Table.Crons.TableGameCron {
    isStartingTime(remainingTime, durations) {
        return remainingTime === durations.placingBets + durations.shakeThePlateDuration;
    }
}
