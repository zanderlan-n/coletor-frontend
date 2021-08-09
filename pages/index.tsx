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
import productList from "../../service/productList.json";
import filteredParams from "../../filteredParams.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GraphicFilteredBySearch } from "../components/GraphicFilteredBySearch";
import { GraphicAgrupedByDay } from "../components/GraphicAgrupedByDay";
import { GraphicCoin } from "../components/GraphicCoin";
import cotacaoDolar from "../../service/cotacaoDolar.json";
import cotacaoBitcoin from "../../service/cotacaoBitcoin.json";
import { Select } from "../components/Select";

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

export default function Home() {
  return (
    <>
      <GraphicFilteredBySearch />

      <div className={styles.chartMoneysContainer}>
        <GraphicCoin
          color="rgb(52, 168, 83)"
          title="Cotação do dolar"
          fontData={cotacaoDolar}
        />
        <GraphicCoin
          color="#F7931A"
          title="Cotação do Bitcoin"
          fontData={cotacaoBitcoin}
        />
      </div>

      <Select />
      {/* <GraphicAgrupedByDay /> */}
    </>
  );
}
