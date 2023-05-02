

export interface TotalMesPessoaDataset {
  id: number
  nome: string
  ano: number
  fechamento: number
  anoFechamento: number
  totaisPessoa: TotalPessoaDataset[]
}

export interface TotalPessoaDataset {
  idPessoa: number
  nome: string
  sobrenome: string
  total: number
  corBackgroud: string
  corBorder: string
}
