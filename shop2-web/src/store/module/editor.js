// initial state
import Work from "../../components/core/models/work";
import { actions as pageActions, mutations as pageMutations } from "./page";
import {
  actions as elementActions,
  mutations as elementMutations
} from "./_element";
import { actions as workActions, mutations as workMutations } from "./_work";

export const state = {
  works: [],
  work: new Work(),
  editingPage: { elements: [] },
  editingElement: null,
  formDetailOfWork: {
    uuidMap2Name: {},
    formRecords: []
  },
  workTemplates: []
};

// getters
export const getters = {};

// actions
export const actions = {
  ...elementActions,
  ...pageActions,
  ...workActions
};

// mutations
export const mutations = {
  ...elementMutations,
  ...pageMutations,
  ...workMutations
};
