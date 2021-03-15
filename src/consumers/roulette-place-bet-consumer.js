import { helpers } from "sc-common";
import { Core } from "sc-game-base";

export default class RoulettePlaceBetConsumer extends Core.BaseEventConsumers.PlaceBetConsumer {
    composeBettingTimeValidationCriteria() {
        const configs = this.gameData.gameConfigs;
        const shakeThePlateTime = this.definition.durations.placingBets + this.definition.durations.shakeThePlateDuration;

        return [
            {
                failure: !configs.enabled,
                notice: helpers.noticeHelper.placeBetNextRound,
            },
            {
                failure:
                    this.gameData.remainingTime >= this.definition.durations.placingBets &&
                    this.gameData.remainingTime <= shakeThePlateTime,
                notice: helpers.noticeHelper.cannotPlaceBet,
            },
            {
                failure:
                    this.gameData.remainingTime < this.definition.durations.lockingBet || this.gameData.remainingTime > shakeThePlateTime,
                notice: helpers.noticeHelper.placeBetNextRound,
            },
        ];
    }

    composeBetAmountValidationCriteria(player, betChoices, totalAmount, freeBet) {
        const configs = this.gameData.gameConfigs;
        const { betTracks } = this.gameData.ingame[player.profile.name] || { betTracks: {} };
        const totalAmountOfExistingBets = this.calculateTotalAmount(betTracks) + totalAmount;
        const minBet = Math.max(player.profile.minBet, configs.minbet);
        const maxBet = Math.min(player.profile.maxBet, configs.maxbet);

        return [
            {
                failure: freeBet && !configs.enableFreeBet,
                notice: helpers.noticeHelper.invalidBet,
            },
            {
                failure: this.anyChoiceExceedItsMaxBet(betChoices, betTracks, configs),
                notice: helpers.noticeHelper.maxBetOfAnyChoiceReached,
            },
            {
                failure: this.anyChoiceNegative(betChoices, betTracks),
                notice: helpers.noticeHelper.betAmountOfAnyChoiceIncorrect,
            },
            {
                failure: totalAmountOfExistingBets + totalAmount < minBet,
                notice: helpers.noticeHelper.minBet(minBet),
            },
            {
                failure: totalAmount > maxBet,
                notice: helpers.noticeHelper.maxBet(maxBet),
            },
            {
                failure: totalAmountOfExistingBets + totalAmount > maxBet,
                notice: helpers.noticeHelper.maxBet(maxBet),
            },
        ];
    }

    composeBetChoiceValidationCriteria(betChoices) {
        const validChoices = this.definition.choices.choicesGroupByType;

        return [
            {
                failure: this.anyInvalidChoice(betChoices, validChoices),
                notice: helpers.noticeHelper.invalidBet,
            },
        ];
    }

    consume(player, payload) {
        Object.assign(payload, {
            amount: this.calculateTotalAmount(payload.betChoices) >> 0,
            freeBet: payload.freeBet ?? false,
        });

        const { amount, betChoices, freeBet } = payload;
        const name = player.profile.name;

        if (!this.validateBetRequest(player, betChoices, amount, freeBet)) {
            return;
        }

        if (!this.gameData.ingame[name]) {
            const newPlayer = {
                name: player.profile.name,
                currency: player.session.currency,
                betTracks: {},
                betQueue: [],
            };

            this.gameData.ingame[name] = newPlayer;
        }

        this.adjustBetTracks(player.profile.name, payload);
        this.gameData.ingame[name].betQueue.push({ player, payload });
    }

    adjustBetTracks(playerName, bet) {
        const { betChoices } = bet;

        if (this.gameData.ingame?.[playerName]) {
            const playerInGame = this.gameData.ingame[playerName];

            Object.entries(betChoices).forEach(([typeOfBets, choicesPerType]) => {
                const trackChoicesPerType = playerInGame.betTracks[typeOfBets] || {};

                Object.entries(choicesPerType).forEach(([betChoice, amount]) => {
                    trackChoicesPerType[betChoice] = (trackChoicesPerType[betChoice] || 0) + amount;
                });

                if (!playerInGame.betTracks[typeOfBets]) {
                    playerInGame.betTracks[typeOfBets] = trackChoicesPerType;
                }
            });
        }
    }

    calculateTotalAmount(betChoices) {
        return Object.values(betChoices).reduce((previousTotalAmount, choicesPerType) => {
            if (choicesPerType) {
                const totalAmountPerType = Object.values(choicesPerType).reduce(
                    (previousTotalAmountPerType, amount) => previousTotalAmountPerType + amount,
                    0
                );

                return previousTotalAmount + totalAmountPerType;
            }

            return previousTotalAmount;
        }, 0);
    }

    anyInvalidChoice(betChoices, validBetChoices) {
        Object.entries(betChoices).some(([typeOfBets, choicesPerType]) => {
            const validBetChoicesPerType = validBetChoices[typeOfBets];

            if (!validBetChoicesPerType) {
                return true;
            }

            return Object.keys(choicesPerType).some((betChoice) => !validBetChoicesPerType.includes(betChoice));
        });
    }

    anyChoiceExceedItsMaxBet(betChoices, betTracks, configs) {
        Object.entries(betChoices).some(([typeOfBets, choicesPerType]) => {
            const maxBetPerChoice = configs.choices_maxbet[typeOfBets] ?? 0;

            return Object.entries(choicesPerType).some(([betChoice, amount]) => {
                const currentBetAmount = betTracks[typeOfBets]?.[betChoice] ?? 0;

                return amount > maxBetPerChoice || currentBetAmount + amount > maxBetPerChoice;
            });
        });
    }

    anyChoiceNegative(betChoices, betTracks) {
        Object.entries(betChoices).some(([typeOfBets, choicesPerType]) => {
            return Object.entries(choicesPerType).some(([betChoice, amount]) => {
                const currentBetAmount = betTracks[typeOfBets]?.[betChoice] ?? 0;

                return currentBetAmount + amount <= 0 || amount <= 0;
            });
        });
    }
}
