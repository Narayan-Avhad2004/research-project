import { Store } from "lucide-react";

import "../styles/components/store-selector.css";

const StoreSelector = ({
  selectedStore,
  setSelectedStore,
  stores = [],
}) => {
  return (
    <div className="store-selector">

      <label>
        Store
      </label>

      <div className="store-select-wrapper">

        <Store size={15} />

        <select
          value={selectedStore}
          onChange={(event) =>
            setSelectedStore(
              event.target.value
            )
          }
        >

          <option value="All Stores">
            All Stores
          </option>

          {stores.map((store) => (
            <option
              key={store.id}
              value={store.name}
            >
              {store.name}
            </option>
          ))}

        </select>

      </div>

    </div>
  );
};

export default StoreSelector;