import { TotalMesPessoaDataset } from "@models/dadosGraficoMensal";
import { Box, Spinner, View, useTheme } from "native-base";
import React, { useEffect, useState } from "react";

import { VictoryChart, VictoryArea } from "victory-native";

type GraficoGastoMensalProps = {
  dados: TotalMesPessoaDataset[];
  loading: boolean;
};
export const GraficoGastoMensal: React.FC<GraficoGastoMensalProps> = ({
  dados,
  loading,
}) => {
  const [data, setData] = useState([]);
  const { colors } = useTheme();
  const buildDataset = (pDados: TotalMesPessoaDataset[]) => {
    const arrangedData = pDados.map((dado) => ({
      x: `${dado.nome}/${dado.anoFechamento}`,
      y: dado.totaisPessoa[0].total,
    }));

    setData(arrangedData);
  };

  useEffect(() => {
    if (!loading) {
      buildDataset(dados);
    }
  }, [dados, loading]);

  return (
    <Box width={"full"}>
      {loading ? (
        <Spinner size={"lg"} />
      ) : (
        <VictoryChart width={400} height={400}>
          <VictoryArea
            data={data}
            interpolation={"natural"}
            style={{
              data: {
                fill: colors.tertiary[400],
                stroke: colors.tertiary[900],
              },
            }}
          />
        </VictoryChart>
      )}
    </Box>
  );
};
