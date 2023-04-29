import { ResumoFaturaPessoas } from "@models/resumoFatura";
import { ERoutes } from "@models/routes.enum";
import { RouteProp } from "@react-navigation/native";

type DetalheFaturaPessoasScreen = {
    resumo: ResumoFaturaPessoas
};

interface AppRoutesParamsList {
    [ERoutes.ROUTE_HOME]: undefined;
    [ERoutes.ROUTE_DETALHES_FATURA_PESSOA]: DetalheFaturaPessoasScreen
}

export type DetalheFaturaPessoasScreenProp = RouteProp<AppRoutesParamsList, ERoutes.ROUTE_DETALHES_FATURA_PESSOA>

export declare global {
    namespace ReactNavigation {
        interface RootParamList extends AppRoutesParamsList {   }
        
    }
}