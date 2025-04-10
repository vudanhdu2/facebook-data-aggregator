import { ACTION_TYPE } from "../type";

export const saveUserInfo = (payload) => {
    return {
        type: ACTION_TYPE.SAVE_USER,
        payload: payload,
    };
};

export const saveDataPrint = (payload) => {
    return {
        type: ACTION_TYPE.SAVE_DATA_PRINT,
        payload: payload,
    };
};

export const countAttachfile = (payload) => {
    return {
        type: ACTION_TYPE.COUNT_ATTACH_FILE,
        payload: payload,
    };
};

export const shiftSelected = (payload) => {
    return {
        type: ACTION_TYPE.SAVE_DATA_SHIFT,
        payload: payload,
    };
};