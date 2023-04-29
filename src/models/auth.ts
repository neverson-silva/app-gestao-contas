export class Usuario {
  id: number;
  conta: string;
  roles: string[];
  pessoa: Pessoa;
  situacao: number;
}

export class Pessoa {
  id: number;
  nome: string;
  sobrenome: string;
  dataNascimento: Date;
  perfil: string;
}
