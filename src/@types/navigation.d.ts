import { ResumoFaturaPessoas } from "@models/resumoFatura";
import { ERoutes } from "@models/routes.enum";
import { RouteProp } from "@react-navigation/native";

type DetalheFaturaPessoasScreen = {
    resumo: ResumoFaturaPessoas
};

type FaturaPessoaScreenParams = {
    idPessoa: number
}

type DetalheLancamentoScreenParams = {
    idLancamento: number
    compraNome: string
}

interface AppRoutesParamsList {
    [ERoutes.ROUTE_HOME]: undefined;
    [ERoutes.ROUTE_DETALHES_FATURA_PESSOA]: DetalheFaturaPessoasScreen;
    [ERoutes.ROUTE_FATURA_PESSOA]: FaturaPessoaScreenParams;
    [ERoutes.ROUTE_DETALHE_LANCAMENTO]: DetalheLancamentoScreenParams

}

export type DetalheFaturaPessoasScreenProp = RouteProp<AppRoutesParamsList, ERoutes.ROUTE_DETALHES_FATURA_PESSOA>
export type FaturaPessoaScreenProps = RouteProp<AppRoutesParamsList, ERoutes.ROUTE_FATURA_PESSOA>
export type DetalheLancamentoScreenProps = RouteProp<AppRoutesParamsList, ERoutes.ROUTE_DETALHE_LANCAMENTO>

export declare global {
    namespace ReactNavigation {
        interface RootParamList extends AppRoutesParamsList {   }
        
    }
}