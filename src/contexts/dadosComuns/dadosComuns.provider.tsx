import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Pessoa } from "@models/auth";
import { FormaPagamento } from "@models/cartao";
import { MesAnoDto } from "@models/mesAno";
import moment from "moment";
import { useAuth } from "@contexts/auth/useAuth";
import { AlertDialog, Button, Center, Skeleton, VStack } from "native-base";
import { api } from "@utils/api";
import { AxiosError } from "axios";
import { delay } from "@utils/util";

type MesAnoData = {
  value: MesAnoDto;
  toDate: () => Date;
  toMoment: () => moment.Moment;
  format: (formato?: string) => string;
  //   format: (formato = "dd [de] MMMM [de] YYYY") => string;
};

type DadosComunsContextData = {
  date: {
    current: MesAnoData;
    selected: MesAnoData;
    changeSelected: (mes: number, ano: number) => void;
    changeSelectedFromDate: (date: Date | moment.Moment) => void;
    meses: Array<{ id: number; nome: string; nomeAbreviado: string }>;
  };
  people: Pessoa[];
  paymentMethods: FormaPagamento[];
};

export const DadosComunsContext = createContext<DadosComunsContextData>(
  {} as unknown as DadosComunsContextData
);

export const DadosComunsProvider: React.FC<PropsWithChildren<any>> = ({
  children,
}) => {
  const { logado, usuario, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const [selectedMesAno, setSelectedMesAno] = useState<{
    mes: number;
    ano: number;
  }>({
    mes: 0,
    ano: 0,
  });

  const [mesAnoAtual, setMesAnoAtual] = useState({
    mes: 0,
    ano: 0,
  });
  const [paymentMethods, setPaymentMethods] = useState<FormaPagamento[]>([]);
  const [people, setPeople] = useState<Pessoa[]>([]);
  const cancelRef = React.useRef(null);

  const [showAlert, setShowAlert] = useState(false);
  const [messageError, setMessageError] = useState<
    { title: string; message: string } | undefined
  >(undefined);

  const meses = useMemo(() => {
    return [
      { id: 1, nome: "Janeiro", nomeAbreviado: "Jan" },
      { id: 2, nome: "Fevereiro", nomeAbreviado: "Fev" },
      { id: 3, nome: "Março", nomeAbreviado: "Mar" },
      { id: 4, nome: "Abril", nomeAbreviado: "Abr" },
      { id: 5, nome: "Maio", nomeAbreviado: "Mai" },
      { id: 6, nome: "Junho", nomeAbreviado: "Jun" },
      { id: 7, nome: "Julho", nomeAbreviado: "Jul" },
      { id: 8, nome: "Agosto", nomeAbreviado: "Ago" },
      { id: 9, nome: "Setembro", nomeAbreviado: "Set" },
      { id: 10, nome: "Outubro", nomeAbreviado: "Out" },
      { id: 11, nome: "Novembro", nomeAbreviado: "Nov" },
      { id: 12, nome: "Dezembro", nomeAbreviado: "Dez" },
    ];
  }, []);

  const buscarMesAnoAtual = async () => {
    try {
      if (!mesAnoAtual?.mes && !mesAnoAtual?.ano) {
        const { data } = await api.get<{
          mesReferencia: number;
          anoReferencia: number;
        }>("meses/mesAtual");

        const anoMes = {
          mes: data.mesReferencia,
          ano: data.anoReferencia,
        };

        setMesAnoAtual(anoMes);
        setSelectedMesAno(anoMes);
      }
    } catch (e) {
      const mesTemp = moment().month() + 1;
      const anoTemp = moment().year();
      setMesAnoAtual({
        mes: mesTemp,
        ano: anoTemp,
      });
      setSelectedMesAno({
        mes: mesTemp,
        ano: anoTemp,
      });
    }
  };

  const buscarCartoesAtivos = async () => {
    try {
      const { data } = await api.get("formas-pagamentos");
      setPaymentMethods(data);
    } catch (e) {
      if (e instanceof AxiosError) {
        setMessageError({
          title: "Oops ocorreu um erro",
          message:
            e?.response?.data?.message ??
            "Ocorreu um erro ao buscar as formas de pagamentos",
        });
      }
    }
  };

  const buscarPessoas = async () => {
    try {
      const { data } = await api.get("pessoas");
      setPeople(data);
    } catch (e) {
      if (e instanceof AxiosError) {
        setMessageError({
          title: "Oops ocorreu um erro",
          message:
            e?.response?.data?.message ??
            "Ocorreu um erro ao buscar as pessoas",
        });
      }
    }
  };

  const currentMonth: MesAnoData = useMemo(() => {
    if (mesAnoAtual) {
      return {
        value: mesAnoAtual,
        toDate: () =>
          moment(`${mesAnoAtual.ano}-${mesAnoAtual.mes}-01`).toDate(),
        toMoment: () => moment(`${mesAnoAtual.ano}-${mesAnoAtual.mes}-01`),
        format: (formato = "DD [de] MMMM [de] YYYY") =>
          moment(`${mesAnoAtual.ano}-${mesAnoAtual.mes}-01`).format(formato),
      };
    }
    return {} as any;
  }, [mesAnoAtual]);

  const selectedMonth: MesAnoData = useMemo(() => {
    if (selectedMesAno) {
      return {
        value: selectedMesAno,
        toDate: () =>
          moment(`${selectedMesAno.ano}-${selectedMesAno.mes}-01`).toDate(),
        toMoment: () =>
          moment(`${selectedMesAno.ano}-${selectedMesAno.mes}-01`),
        format: (formato = "DD [de] MMMM [de] YYYY") =>
          moment(`${selectedMesAno.ano}-${selectedMesAno.mes}-01`).format(
            formato
          ),
      };
      return {} as any;
    }
  }, [selectedMesAno]);

  const dates = useMemo(() => {
    return {
      current: currentMonth,
      selected: selectedMonth,
      changeSelected: (mes: number, ano: number) => {
        setSelectedMesAno({
          mes,
          ano,
        });
      },
      changeSelectedFromDate: (pDate: Date | moment.Moment) => {
        const mes = moment(pDate).month() + 1;
        const ano = moment(pDate).year();

        console.log("alterou mes e ano", mes, ano, pDate);
        setSelectedMesAno({
          mes,
          ano,
        });
      },
      meses,
    };
  }, [selectedMesAno, currentMonth, selectedMonth]);

  const contextData = useMemo(() => {
    return {
      paymentMethods,
      date: dates,
      people,
    };
  }, [paymentMethods, people, dates]);

  const init = async () => {
    setLoading(true);
    await buscarMesAnoAtual();
    await buscarCartoesAtivos();
    await buscarPessoas();
    setLoading(false);
  };

  useEffect(() => {
    setMessageError(undefined);
    if (logado) {
      init();
    }
  }, [logado, usuario]);

  const LoadingApp = () => {
    return (
      <Center w="full" height={"full"} bgColor={"white"}>
        <VStack
          w="full"
          height={"full"}
          borderWidth="1"
          space={8}
          overflow="hidden"
          rounded="md"
          _dark={{
            borderColor: "coolGray.500",
          }}
          _light={{
            borderColor: "coolGray.200",
          }}
        >
          <Skeleton h="240" />
          <Skeleton.Text px="4" />
          <Skeleton px="4" my="4" rounded="md" startColor="primary.200" />
        </VStack>
      </Center>
    );
  };

  if (!loading && showAlert) {
    return (
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={showAlert}
          onClose={() => {
            setShowAlert(false);
            logout();
          }}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>{messageError?.title}</AlertDialog.Header>
            <AlertDialog.Body>{messageError?.message}</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  colorScheme="danger"
                  onPress={() => {
                    setShowAlert(false);
                    logout();
                  }}
                >
                  Entendido
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    );
  }
  return (
    <DadosComunsContext.Provider value={contextData}>
      {loading ? <LoadingApp /> : children}
    </DadosComunsContext.Provider>
  );
};
