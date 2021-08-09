import styles from "./index.module.scss";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GraphicDolarProps {
  fontData: any[];
  title: string;
  color: string;
}

export function GraphicCoin({ fontData, title, color }: GraphicDolarProps) {
  const filter = [];

  fontData?.forEach((item) => {
    const alreadyExists = filter.find((findItem) => {
      if (
        findItem?.dataDaColeta === item?.dataDaColeta &&
        findItem?.valor === item?.valor
      ) {
        return findItem;
      }
    });

    if (!alreadyExists) {
      filter.push(item);
    }
  });

  return (
    <div className={styles.container}>
      <h1 style={{ margin: "30px 0px", color }}>{title}</h1>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={filter}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
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
          <Line
            type="monotone"
            dataKey="valor"
            stroke={color}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
