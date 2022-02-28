import { Table } from "sc-game-base";
import { trackBetChoices, buildBetAmountIncrement } from "../helpers/choice-helper";

export default class RouletteProcessBetQueue extends Table.Crons.TableProcessBetQueue {
    decreaseBetTracks(playerName, bet) {
        this.adjustBetTracks(playerName, bet, true);
    }

    async upsertBet(player, roundId, bet, rate) {
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
            newBet.partnerId = player.session.partnerId;
            newBet.currency = player.session.currencyName;
            newBet.rate = rate;
            newBet.operatorId = player.session.partnerId;
            newBet.playerId = player.session.memberId;
        }

        await this.betsRepository.updateOne(
            existingBetFilter,
            { $inc: existingBetIncrement, $setOnInsert: newBet },
            { upsert: true, setDefaultsOnInsert: true }
        );
    }

    async insertBetLog(player, roundId, bet, rate) {
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
            newBetLog.partnerId = player.session.partnerId;
            newBetLog.currency = player.session.currencyName;
            newBetLog.rate = rate;
            newBetLog.operatorId = player.session.partnerId;
            newBetLog.playerId = player.session.memberId;
        }

        await this.betLogsRepository.create(newBetLog);
    }

    adjustTotalBets(player, bet, rate) {
        const totalBets = this.gameData.totalBets;

        trackBetChoices(totalBets, bet.betChoices, rate);
    }

    formatApiBetInfo(payload) {
        return {
            amount: payload.amount,
            gameId: this.definition.id,
            gameRoundId: this.gameData.roundId,
            freeBet: payload.freeBet,
        };
    }

    generatePlacingBetResult(player, balance, bet, rate) {
        const { betChoices, amount } = bet;
        const ownBet = super.generatePlacingBetResult(player, balance, bet, rate);

        ownBet.ownChip = { betChoices, amount };

        return ownBet;
    }

    updateGameDataChips(bet, rate) {
        const { betChoices } = bet;

        if (!this.gameData.chips[rate]) {
            this.gameData.chips[rate] = {};
        }

        const chipRate = this.gameData.chips[rate];

        Object.entries(betChoices).forEach(([typeOfBets, choicesPerType]) => {
            if (!chipRate[typeOfBets]) {
                chipRate[typeOfBets] = {};
            }
            const trackChoicesPerType = chipRate[typeOfBets];

            Object.entries(choicesPerType).forEach(([betChoice, choiceAmount]) => {
                trackChoicesPerType[betChoice] = trackChoicesPerType[betChoice] ?? {};
                trackChoicesPerType[betChoice][choiceAmount] = (trackChoicesPerType[betChoice][choiceAmount] || 0) + 1;
            });
        });
    }

    adjustBetTracks = (playerName, bet, reduce = false) => {
        if (this.gameData.ingame?.[playerName]) {
            const { betTracks } = this.gameData.ingame[playerName];

            trackBetChoices(betTracks, bet.betChoices, 1, reduce);
        }
    };
}
