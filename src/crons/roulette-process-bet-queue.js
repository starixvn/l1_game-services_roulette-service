import { Table } from "sc-game-base";
import { trackBetChoices, buildBetAmountIncrement } from "../helpers/choice-helper";

export default class ProcessBetQueue extends Table.Crons.TableProcessBetQueue {
    decreaseBetTracks(playerName, bet) {
        this.adjustBetTracks(playerName, bet, true);
    }

    async upsertBet(player, roundId, bet) {
        const configs = this.gameData.gameConfigs;
        const newBet = {
            uid: player.UID,
            name: player.profile.name,
            phien: roundId,
            time: new Date(),
            odds: configs.odds,
            freeBet: bet.freeBet,
        };
        const existingBetFilter = { uid: player.UID, phien: roundId, freeBet: bet.freeBet };
        const existingBetIncrement = { ...buildBetAmountIncrement(bet.betChoices), totalAmount: bet.amount };

        if (player.session) {
            newBet.memberId = player.session.memberId;
            newBet.siteId = player.session.siteId;
        }

        await this.betsRepository.updateOne(
            existingBetFilter,
            { $inc: existingBetIncrement, $setOnInsert: newBet },
            { upsert: true, setDefaultsOnInsert: true }
        );
    }

    async insertBetLog(player, roundId, bet) {
        const newBetLog = {
            uid: player.UID,
            name: player.profile.name,
            phien: roundId,
            time: new Date(),
            freeBet: bet.freeBet,
            ...bet.betChoices,
        };

        if (player.session) {
            newBetLog.memberId = player.session.memberId;
            newBetLog.siteId = player.session.siteId;
        }

        await this.betLogsRepository.create(newBetLog);
    }

    adjustTotalBets(player, bet) {
        const totalBets = this.gameData.totalBets;

        trackBetChoices(totalBets, bet.betChoices);
    }

    formatApiBetInfo(payload) {
        return {
            amount: payload.amount,
            gameId: this.definition.id,
            gameRoundId: this.gameData.roundId,
            freeBet: payload.freeBet,
        };
    }

    generatePlacingBetResult(player, balance, bet) {
        const { betChoices, amount } = bet;
        const ownBet = super.generatePlacingBetResult(player, balance, bet);

        ownBet.ownChip = { betChoices, amount };

        return ownBet;
    }

    adjustBetTracks = (playerName, betChoices, reduce = false) => {
        if (this.gameData.ingame?.[playerName]) {
            const betTracks = this.gameData.ingame[playerName];

            trackBetChoices(betTracks, betChoices, reduce);
        }
    };
}
