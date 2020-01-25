console.log("#### AD CONTENT-BUSTER ####");

import { Blocker } from "./blocker_general";

let blocker = new Blocker([
    {
        selector: 'body',
        type: 'big'
    },
]);

blocker.modifyContent([document]);
blocker.watchPageForMutations();
