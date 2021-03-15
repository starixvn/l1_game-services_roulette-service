import { Core } from "sc-game-base";

export default class RouletteHistoryQuery extends Core.QueryApis.HistoryQuery {
    getBetLogDetails(player, roundId) {
        return this.betLogsRepository
            .find(
                { phien: roundId, uid: player.UID },
                {
                    _id: false,
                    uid: false,
                    phien: false,
                    memberId: false,
                    siteId: false,
                    __v: false,
                },
                { sort: { _id: -1 } }
            )
            .lean()
            .exec();
    }
}
