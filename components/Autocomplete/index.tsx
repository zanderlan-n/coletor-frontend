/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { Placa } from "../Select";
import styles from "./index.module.scss";
import ReactLoading from "react-loading";

interface AutocompleteProps {
  data: Placa[];
  setOptionSelected: (value: Placa) => void;
  optionSelected: Placa[];
}

export const Autocomplete = ({
  data,
  setOptionSelected,
  optionSelected,
}: AutocompleteProps) => {
  const [value, setValue] = useState("");
  const [valueInputed, setValueInputed] = useState("");
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce<string>(value, 700);
  const [open, setOpen] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setValueInputed(event.target.value);
    if (event.target.value !== "") {
      setLoading(true);
    }
    setOpen(true);
  };

  const loadOptions = data
    ?.filter((item) => {
      if (value) {
        if (
          item?.nome
            ?.toLowerCase()
            ?.replaceAll(" ", "")
            ?.indexOf(value?.toLowerCase()?.replaceAll(" ", "")) !== -1
        ) {
          return item?.nome && item;
        }
      }
    })
    .sort((a, b) => {
      const preco1 = Number(
        a?.preco?.replaceAll("R$", "")?.replaceAll(".", "").replaceAll(",", ".")
      );
      const preco2 = Number(
        b?.preco?.replaceAll("R$", "")?.replaceAll(".", "").replaceAll(",", ".")
      );

      if (preco1 < preco2) {
        return -1;
      }
    });

  useEffect(() => {
    setLoading(false);
  }, [debouncedValue]);

  return (
    <div className={styles.container}>
      <div className={styles.containerInput}>
        <input
          onFocus={() => {
            setOpen(true);
            setValue(valueInputed);
          }}
          spellCheck="false"
          className={styles.input}
          value={value}
          onChange={handleChange}
          type="text"
        />
        <div className={styles.icon}>
          {loading && (
            <ReactLoading type="spin" color="#76b900" height={20} width={20} />
          )}
          {!loading && !open && (
            <img src="./assets/arrow-down.svg" alt="arrow-down" />
          )}
          {!loading && open && (
            <img src="./assets/arrow-up.svg" alt="arrow-up" />
          )}
        </div>
      </div>

      {open && (
        <div className={styles.containerItem}>
          {loadOptions?.map((option, index) => {
            return (
              <div
                key={index}
                className={`${styles.item} ${
                  option?.nome === optionSelected[0]?.nome
                    ? styles.selected
                    : styles.item
                }`}
                onClick={() => {
                  setOptionSelected(option);
                  setValue(option?.nome);
                  setOpen(false);
                }}
              >
                <p>{option?.nome}</p>

                <p>
                  <strong>{option?.quantidade} quantidade</strong>{" "}
                  <span style={{ color: "#76b900" }}>{option?.loja}</span>
                </p>

                <p>
                  Primeiro registro:{" "}
                  <strong>
                    {option?.preco} {option?.dataDaColeta}
                  </strong>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
