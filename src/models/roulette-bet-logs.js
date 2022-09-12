import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    time: { type: Date, required: true },

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

    siteId: { type: String },

    currency: { type: String, require: true },
    rate: { type: Number, require: true },

    playerId: { type: Number },
    operatorId: { type: String, required: false },
    roundId: { type: Number, required: true },
});

export default mongoose.model("Roulette_cuoc", schema);
