import createPersistedState from "use-persisted-state";

const useActiveConnector = createPersistedState(
  "@@kleros/escrow/active-connector"
);

export default useActiveConnector;
