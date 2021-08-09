import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  LineChart,
} from "recharts";
import styles from "./index.module.scss";
import productList from "../../../service/productList.json";
import filteredParams from "../../../filteredParams.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Placa {
  prefixo: string;
  nome: string;
  preco: number;
  url: string;
  loja?: string;
  dataDaColeta: string;
}

interface Cards {
  low: Placa;
  hight: Placa;
}

interface SearchParams {
  nome: string;
  data: string;
  searchBy: string;
  remove: string;
}

export function GraphicFilteredBySearch() {
  function getShortName(nome: string) {
    let initial;

    filteredParams.forEach((param) => {
      if (nome.toLowerCase().indexOf(param.toLowerCase()) !== -1) {
        initial = nome.toLowerCase().indexOf(param.toLowerCase());
      }
    });

    return nome.slice(initial, initial + 14);
  }

  const [searchByName, setSearchByName] = useState({
    nome: "",
    data: "",
    searchBy: "day",
    remove: "",
  });

  const [formattedData, setFormattedData] = useState<Placa[]>([]);

  const [filterDates, setFilterDates] = useState([]);

  const [filterData, setFilterData] = useState<Placa[]>([]);

  const [cardsValue, setCardsValue] = useState<Cards>();

  const removeWith = (products: Placa[], removeBy: string) => {
    const filter = products.filter((product) => {
      if (product.nome.toLowerCase().indexOf(` ${removeBy} `) === -1) {
        return product;
      }
    });

    return filter;
  };

  const lowAndHightValues = (products: Placa[]) => {
    let hight: Placa;
    let low: Placa;
    products.forEach((item) => {
      if (item?.preco > hight?.preco || !hight?.preco) {
        hight = item;
      }

      if (item?.preco < low?.preco || !low?.preco) {
        low = item;
      }
    });

    setCardsValue({ hight, low });
  };

  const filterByName = (nome: string, products: Placa[]) => {
    const filter = products.filter((item) => {
      if (
        item?.nome
          ?.replaceAll(" ", "")
          .toLocaleLowerCase()
          .indexOf(nome.replaceAll(" ", "").toLocaleLowerCase()) > -1
      ) {
        return item;
      }
    });

    return filter;
  };

  const search = (values?: SearchParams, productList?: Placa[]) => {
    let params = searchByName;
    if (values) {
      params = values;
    }

    let products = formattedData;

    if (productList) {
      products = productList;
    }

    if (params?.remove) {
      products = removeWith(products, params?.remove);
    }

    if (params.data !== "") {
      const filter = products.filter((item) => {
        if (params.searchBy === "day") {
          if (item?.dataDaColeta.split(" ")[0] === params.data) {
            return item;
          }
        }

        if (item?.dataDaColeta === params.data) {
          return item;
        }
      });
      const filteredByName = filterByName(params.nome, filter);
      setFilterData(filteredByName);
      lowAndHightValues(filteredByName);
    } else {
      const filteredByName = filterByName(params.nome, products);
      setFilterData(filteredByName);
      lowAndHightValues(filteredByName);
    }
  };

  useEffect(() => {
    const parsedData = productList
      .map((item) => {
        if (getShortName(item.nome) !== "") {
          return {
            ...item,
            preco: Number(
              item.preco
                .replaceAll("R$", "")
                .replaceAll(".", "")
                .replaceAll(",", ".")
            ),
            prefixo: getShortName(item.nome),
          };
        }
      })
      .filter((e) => e);

    const dates = [];

    parsedData.forEach((item) => {
      if (!dates.find((e) => item?.dataDaColeta === e)) {
        dates.push(item.dataDaColeta);
      }
    });

    setFilterDates(dates);
    setFormattedData(parsedData);
    setFilterData(parsedData);
    lowAndHightValues(parsedData);
    setSearchByName({ ...searchByName, data: dates[dates.length - 1] });
    search({ ...searchByName, data: dates[dates.length - 1] }, parsedData);
  }, []);

  return (
    <div className={styles.container}>
      <h1 style={{ margin: "30px 0px" }}>Filtro a cada pesquisa feita</h1>

      <section className={styles.filters}>
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === "day") {
              const dates = filterDates.map((data) => data.split(" ")[0]);

              const removeEquals = [];

              dates.forEach((date) => {
                if (!removeEquals.find((e) => e === date)) {
                  removeEquals.push(date);
                }
              });
              setFilterDates(removeEquals);
              setSearchByName({ ...searchByName, searchBy: "day" });
            } else {
              const dates = [];

              productList.forEach((item) => {
                if (!dates.find((e) => item?.dataDaColeta === e)) {
                  dates.push(item.dataDaColeta);
                }
                setFilterDates(dates);
                setSearchByName({ ...searchByName, searchBy: "search" });
              });
            }
          }}
        >
          <option value="search">A cada pesquisa</option>
          <option value="day">Por dia</option>
        </select>

        <select
          onChange={(value) => {
            if (value.target.value === "defaul") {
              return setSearchByName({ ...searchByName, data: "" });
            }
            setSearchByName({ ...searchByName, data: value.target.value });
          }}
          name="date"
          id="date"
          placeholder="Data de busca"
        >
          Data de busca
          {filterDates.map((date) => (
            <option
              selected={searchByName.data === date}
              key={date}
              value={date}
            >
              {date}
            </option>
          ))}
        </select>

        <input
          placeholder="Procure pelo nome"
          onChange={(e) =>
            setSearchByName({ ...searchByName, nome: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="remover as..."
          onChange={(e) =>
            setSearchByName({ ...searchByName, remove: e.target.value })
          }
        />
        <button onClick={() => search()}>Buscar</button>
      </section>

      <section className={styles.contentCards}>
        <section className={styles.lowestValueFound}>
          <a href={cardsValue?.low?.url} target="_blank" rel="noreferrer">
            <h4 className={styles.nome}>{cardsValue?.low?.nome}</h4>
            <p className={styles.preco}>
              {cardsValue?.low?.preco?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p className={styles.loja}>{cardsValue?.low?.loja}</p>
            <p className={styles.data}>{cardsValue?.low?.dataDaColeta}</p>
          </a>
        </section>

        <section className={styles.highestValueFound}>
          <a href={cardsValue?.hight?.url} target="_blank" rel="noreferrer">
            <h4 className={styles.nome}>{cardsValue?.hight?.nome}</h4>
            <p className={styles.preco}>
              {cardsValue?.hight?.preco?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p className={styles.loja}>{cardsValue?.hight?.loja}</p>
            <p className={styles.data}>{cardsValue?.hight?.dataDaColeta}</p>
          </a>
        </section>
      </section>

      <div className={styles.chart}>
        <ResponsiveContainer width="99%" height="80%">
          <BarChart data={filterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="prefixo" />
            <YAxis
              width={120}
              tickFormatter={(e) => {
                return e.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
              }}
            />
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <Bar
              dataKey="preco"
              fill="#76b900"
              onClick={(e) => {
                const linkSource = e?.url;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.target = "_blank";
                downloadLink.click();
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}