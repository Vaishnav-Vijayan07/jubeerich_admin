// constants
import { ProgramsActionTypes } from "./constants";

export interface ProgramActionType {
  type:
    | ProgramsActionTypes.API_RESPONSE_SUCCESS
    | ProgramsActionTypes.API_RESPONSE_ERROR
    | ProgramsActionTypes.GET_PROGRAM
    | ProgramsActionTypes.ADD_PROGRAM
    | ProgramsActionTypes.UPDATE_PROGRAM
    | ProgramsActionTypes.DELETE_PROGRAM;
  payload: {} | string;
}

interface ProgramData {
  program_name: string;
  university_id: string;
  degree_level: string;
  duration: string;
  tuition_fees: string;
  currency: string;
}

// common success
export const programApiResponseSuccess = (
  actionType: string,
  data: ProgramData | {}
): ProgramActionType => ({
  type: ProgramsActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const programApiResponseError = (
  actionType: string,
  error: string
): ProgramActionType => ({
  type: ProgramsActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getProgram = (): ProgramActionType => ({
  type: ProgramsActionTypes.GET_PROGRAM,
  payload: {},
});

export const addProgram = (
  program_name: string,
  university_id: string,
  degree_level: string,
  duration: string,
  tuition_fees: string,
  currency: string
): ProgramActionType => ({
  type: ProgramsActionTypes.ADD_PROGRAM,
  payload: {
    program_name,
    university_id,
    degree_level,
    duration,
    tuition_fees,
    currency,
  },
});

export const updateProgram = (
  id: string,
  program_name: string,
  university_id: string,
  degree_level: string,
  duration: string,
  tuition_fees: string,
  currency: string
): ProgramActionType => ({
  type: ProgramsActionTypes.UPDATE_PROGRAM,
  payload: {
    id,
    program_name,
    university_id,
    degree_level,
    duration,
    tuition_fees,
    currency,
  },
});

export const deleteProgram = (id: string): ProgramActionType => ({
  type: ProgramsActionTypes.DELETE_PROGRAM,
  payload: { id },
});
