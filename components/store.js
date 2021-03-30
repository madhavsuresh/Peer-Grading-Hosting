import React, { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();
const initialState = {
    user_id: '1',
    context_id: '1',
    context_name: '',
    roles: [],
    assignment: '1', // Course Evaluation Essay
};

const reducer = (state, action) => {
  switch(action.type) {
    case "createUser":
      state.roles = [];
      if (action.instructor) state.roles.push('instructor');
      if (action.ta) state.roles.push('ta');
      if (action.student) state.roles.push('student');
      if (action.admin) state.roles.push('admin');
      return {
        user_id: action.user_id,
        context_id: action.context_id,
        context_name: action.context_name,
        roles: state.roles,
        assignment: action.assignment,
      }
      case "reset":
        return {
          user_id: '',
          context_id: '',
          context_name: '',
          roles: [],
          assignment: '',
        }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext);