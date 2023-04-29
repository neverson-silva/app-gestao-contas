import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class AutenticacaoDTO {
  @IsEmail({}, { message: "Informe um e-mail válido" })
  email: string;

  @MinLength(5, { message: "Senha deve ter no mínimo 5 caracteres" })
  @IsNotEmpty({ message: "Senha é obrigatória" })
  senha: string;
}
