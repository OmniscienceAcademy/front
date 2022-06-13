import { useState } from "react";
import Style from "@styles/components/Home/SearchBar.module.scss";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { IYearRange } from "../../common/types";
import { autocompletion } from "../../common/api";

interface SearchBarProps {
  onSearch: (str: string, yearRange: IYearRange) => void;
  className?: string;
  initialInput?: string;
  yearRange: IYearRange;
  autofocus: boolean;
}

type Item = {
  key: number;
  type: string;
  name: string;
};

export default function SearchBar({
  onSearch,
  className,
  initialInput,
  yearRange,
  autofocus,
}: SearchBarProps) {
  const items0 = [
    {
      key: 0,
      type: "",
      name: initialInput || "",
    },
  ];

  const [items, setItems] = useState(items0);

  const addListener = (string: string) => {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        const yearRangeNewQuery =
          string === initialInput ? yearRange : { startYear: 0, endYear: 2022 };
        onSearch(string, yearRangeNewQuery);
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const handleOnSearch = (string: string, results: any) => {
    // Function called a each new caracter entered in the search bar
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    addListener(string);
    if (string.length > 0) {
      autocompletion(string).then((res) => {
        setItems(res.autocompletion);
      });
    }
  };

  const handleOnSelect = (item: Item) => {
    // the item selected when clicking on a recommandation
    const input = item.name;
    const yearRangeNewQuery =
      input === initialInput ? yearRange : { startYear: 0, endYear: 2022 };
    onSearch(input, yearRangeNewQuery);
  };

  const handleOnFocus = () => {
    setItems(items);
    addListener(items[0].name);
  };

  const handleOnHover = (item: Item) => {
    addListener(item.name);
  };

  const formatResult = (item: Item) => (
    <>
      <span style={{ display: "block", textAlign: "left" }}>
        {item.type} {item.name}
      </span>
    </>
  );
  return (
    <div className={`${Style.wrapper} ${className}`}>
      <ReactSearchAutocomplete<Item>
        items={items}
        onSearch={handleOnSearch}
        onSelect={handleOnSelect}
        autoFocus={autofocus}
        formatResult={formatResult}
        onFocus={handleOnFocus}
        onHover={handleOnHover}
        inputSearchString={initialInput}
        fuseOptions={{ threshold: 1, shouldSort: false }}
        placeholder={"Search any topic. Ex: 'What is Reinforcement learning'"}
        inputDebounce={200}
      />
    </div>
  );
}
