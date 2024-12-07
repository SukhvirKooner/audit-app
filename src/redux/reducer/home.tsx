import {GET_AUDITS, GET_AUDITS_DETAILS} from '../actionTypes';

interface CommonState {
  auditsList: any[];
  auditsDetailsList: any[];
}

const initialState: CommonState = {
  auditsList: [],
  auditsDetailsList: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_AUDITS: {
      return {...state, auditsList: action.payload};
    }
    case GET_AUDITS_DETAILS: {
      return {...state, auditsDetailsList: action.payload};
    }

    default:
      return state;
  }
}
