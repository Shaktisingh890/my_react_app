import React, { useState } from "react";
import { colorList } from "consts/color";
import { Container } from "./style";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { InputField } from "app/components/atoms/inputField";
import _ from "lodash";
import { Search, XLg } from "@styled-icons/bootstrap";

interface ISearchProps {
  searchArray: any;
  searchKeys: string[];
  handleSearch: any;
}

export const SearchField = (props: ISearchProps) => {
  const { searchArray, searchKeys, handleSearch } = props;
  const [resetInput, setResetInput] = useState<boolean>(false);

  const { t } = useTranslation();

  const search = (keyword) =>
    searchArray.filter((term) =>
      searchKeys.some((attribute) =>
        _.get(term, attribute).toLowerCase().includes(keyword)
      )
    );

  const onChange = (val: string) => {
    handleSearch(search(val.toLowerCase()));
    setResetInput(false);
  };

  const onDelete = () => {
    setResetInput(true);
    handleSearch(search(""));
  };

  return (
    <Container>
      <Search size={20} color={colorList.variant14} />
      <InputField
        handleInputChange={onChange}
        placeholder={t(translations.GENERIC.SEARCH)}
        showBorder={false}
        id="searchInput"
        reset={resetInput}
      />
      <XLg
        size={20}
        color={colorList.variant15}
        onClick={onDelete}
        className="cursor"
      />
    </Container>
  );
};
