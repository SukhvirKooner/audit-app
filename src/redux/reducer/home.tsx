import {
  GET_AUDITS,
  GET_AUDITS_DETAILS,
  GET_AUDITS_DETAILS_DATA,
  GET_TEMPLATE,
} from '../actionTypes';

interface CommonState {
  auditsList: any[];
  auditsDetailsList: any[];
  templateData: any;
  auditDetails: any;
}

const initialState: CommonState = {
  auditsList: [],
  auditsDetailsList: [],
  templateData: null,
  auditDetails: null,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_AUDITS: {
      return {...state, auditsList: action.payload};
    }
    case GET_AUDITS_DETAILS: {
      return {...state, auditsDetailsList: action.payload};
    }

    case GET_AUDITS_DETAILS_DATA: {
      return {...state, auditDetails: action.payload};
    }

    case GET_TEMPLATE: {
      return {...state, templateData: action.payload};
    }

    default:
      return state;
  }
}
