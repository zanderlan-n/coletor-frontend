import styles from "./index.module.scss";

import productList from "../../../service/productList.json";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { isAfter } from "date-fns";

interface Placa {
  nome: string;
  preco: string;
  url: string;
  loja?: string;
  dataDaColeta: string;
  quantidade: number;
}

interface Cards {
  low: Placa;
  hight: Placa;
  variacao?: number;
  variationIsPositive?: boolean;
  ultimoPreco?: string;
}

export function Select() {
  const options: Placa[] = [];

  productList.forEach((item) => {
    const alreadyExists = options?.findIndex((e) => e?.nome === item?.nome);
    if (alreadyExists !== -1) {
      options[alreadyExists] = {
        ...options[alreadyExists],
        quantidade: options[alreadyExists]?.quantidade + 1,
      };
    } else {
      options.push({ ...item, quantidade: 1 });
    }
  });

  const appearMoreThanOnce = options.filter((item) => item?.quantidade > 1);

  const [data, setData] = useState([]);

  const [minAndMaxValue, setMinAndMaxValue] = useState<Cards>();

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

    if (hight && low) {
      const variationIsPositive = isAfter(
        new Date(low?.dataDaColeta),
        new Date(hight?.dataDaColeta)
      );
      const variacao = variationIsPositive
        ? Number(hight?.preco) - Number(low?.preco)
        : Number(low?.preco) - Number(hight?.preco);

      setMinAndMaxValue({
        hight,
        low,
        variacao,
        variationIsPositive,
        ultimoPreco: products[products?.length - 1]?.preco,
      });
      return;
    }
    setMinAndMaxValue({
      hight,
      low,
      ultimoPreco: products[products?.length - 1]?.preco,
    });
  };

  useEffect(() => {
    lowAndHightValues(data);
  }, [data]);

  return (
    <div className={styles.container}>
      <h1>Placas que apareceram mais de 1 vez nas pesquisas</h1>
      <select
        name="placa"
        id="placa"
        onChange={(e) => {
          setData(
            productList
              .map((item) => {
                if (item.nome === e.target.value) {
                  const parsed = {
                    ...item,
                    preco: Number(
                      item?.preco
                        .replaceAll("R$", "")
                        .replaceAll(".", "")
                        .replaceAll(",", ".")
                    ),
                  };
                  return parsed;
                }
              })
              .filter((e) => e)
          );
        }}
      >
        <option value=""></option>
        {appearMoreThanOnce?.map((item) => (
          <option key={item.nome} value={item?.nome}>
            {item.nome} {""} {item?.loja} {item?.quantidade} quantidade
          </option>
        ))}
      </select>

      {data[0]?.nome && (
        <section className={styles.lowestValueFound}>
          <h4 className={styles.nome}>{data[0]?.nome}</h4>
          <p className={styles.preco}>
            {data[0]?.preco?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <p>
            Variação de preço:{" "}
            <span
              className={
                minAndMaxValue.variationIsPositive ? styles.god : styles.bad
              }
            >
              {minAndMaxValue?.variacao?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
          <p>
            Ultimo preço encontrado:{" "}
            {Number(minAndMaxValue?.ultimoPreco)?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </section>
      )}

      <ResponsiveContainer width="99%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dataDaColeta" />
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
  );
}
