import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    straightUp: { type: Object },
    split: { type: Object },
    street: { type: Object },
    triangle: { type: Object },
    corner: { type: Object },
    fourNumbers: { type: Object },
    line: { type: Object },
    column: { type: Object },
    dozen: { type: Object },
    redBlack: { type: Object },
    oddEven: { type: Object },
    bigSmall: { type: Object },

    thanhtoan: { type: Boolean, default: false },
    totalAmount: { type: Number, default: 0 },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
});

const bets = mongoose.model("Roulette_one", schema);
const tmpBets = mongoose.model("Roulette_tmpone", schema);

export { bets as RouletteBets, tmpBets as RouletteTmpBets };
