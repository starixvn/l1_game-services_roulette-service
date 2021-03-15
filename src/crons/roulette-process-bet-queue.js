import { Table } from "sc-game-base";

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
        const existingBetIncrement = { ...this.buildBetAmountIncrement(bet.betChoices), totalAmount: bet.amount };

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

        this.trackBetChoices(totalBets, bet.betChoices);
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

    buildBetAmountIncrement(betChoices) {
        const increment = {};

        Object.entries(betChoices).forEach(([typeOfBets, choicesPerType]) => {
            Object.entries(choicesPerType).forEach(([betChoice, amount]) => {
                increment[`${typeOfBets}.${betChoice}`] = amount;
            });
        });

        return increment;
    }

    adjustBetTracks = (playerName, betChoices, reduce = false) => {
        if (this.gameData.ingame?.[playerName]) {
            const betTracks = this.gameData.ingame[playerName];

            this.trackBetChoices(betTracks, betChoices, reduce);
        }
    };

    trackBetChoices(tracks, betChoices, reduce = false) {
        Object.entries(betChoices).forEach(([typeOfBets, choicesPerType]) => {
            const trackChoicesPerType = tracks[typeOfBets] || {};

            Object.entries(choicesPerType).forEach(([betChoice, amount]) => {
                trackChoicesPerType[betChoice] = reduce
                    ? trackChoicesPerType[betChoice] - amount
                    : (trackChoicesPerType[betChoice] || 0) + amount;
            });

            if (!tracks[typeOfBets]) {
                tracks[typeOfBets] = trackChoicesPerType;
            }
        });
    }
}
