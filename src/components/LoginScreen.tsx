import { useState } from 'react';
import { Button } from './ui/button'; 
import { Input } from './ui/input'; 
import { Label } from './ui/label'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'; 
import logoZanzaBackground from '../assets/1c4f3f4f4e4b8e2f3c6d7e8f9a0b1c2d3e4f5a6b.png';
import { authService } from '../services/auth.service';
import { UsuarioRequestDTO } from '../types'; // ajuste se necessário

interface LoginScreenProps {
  onLogin: (userData: any, hasAccount: boolean) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

  const handleLogin = async () => {
    const user = await authService.login(loginEmail, loginPassword);
    if (user) onLogin(user, true);
    else alert('Email ou senha incorretos');
  };

  const handleRegister = async () => {
    const dto: UsuarioRequestDTO = {
      nome: registerName,
      email: registerEmail,
      senha: registerPassword,
      telefone: registerPhone,
    };

    console.log('DTO enviado:', dto);

    try {
      const user = await authService.register(dto);
      console.log('Resposta do register:', user);

      if (user) {
        console.log('Conta criada com sucesso!');
        onLogin(user, true);
      } else {
        console.warn('Nenhum usuário retornado. Pode ser erro no backend.');
        alert('Erro ao criar conta');
      }
    } catch (err) {
      console.error('Erro capturado durante register:', err);
      alert('Erro ao criar conta: verifique o console');
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="relative w-full max-w-sm h-screen overflow-y-auto bg-white shadow-lg rounded-none">
        <div className="h-[55%] flex justify-center items-center bg-[#0096FF]">
          <img src={logoZanzaBackground} alt="Logo Zanza" className="max-h-full max-w-full object-contain" />
        </div>

        <div className="bg-white rounded-t-3xl p-6 shadow-2xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="rounded-xl">Entrar</TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl">Criar conta</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} id="email" type="email" placeholder="seu@email.com" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} id="password" type="password" placeholder="••••••••" className="rounded-xl" />
              </div>
              <Button className="w-full bg-[#4285F4] hover:bg-[#3367D6] rounded-xl h-12" onClick={handleLogin}>
                Entrar com conta
              </Button>
            </TabsContent>

            {/* Registrar */}
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  value={registerName}
                  onChange={e => setRegisterName(e.target.value)}
                  id="name"
                  placeholder="Seu nome"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-register">E-mail</Label>
                <Input
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  id="email-register"
                  type="email"
                  placeholder="seu@email.com"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-register">Telefone</Label>
                <Input
                  value={registerPhone}
                  onChange={e => {
                    const onlyNumbers = e.target.value.replace(/\D/g, '');
                    let formatted = onlyNumbers;
                    if (onlyNumbers.length > 0) formatted = `(${onlyNumbers.slice(0,2)}`;
                    if (onlyNumbers.length > 2) formatted += `) ${onlyNumbers.slice(2,7)}`;
                    if (onlyNumbers.length > 7) formatted += `-${onlyNumbers.slice(7,11)}`;
                    setRegisterPhone(formatted);
                  }}
                  id="phone-register"
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                  className="rounded-xl"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-register">Senha</Label>
                <Input
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  id="password-register"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl"
                />
              </div>

              <Button
                className="w-full bg-[#4285F4] hover:bg-[#3367D6] rounded-xl h-12"
                onClick={() => {
                  const phoneNumbers = registerPhone.replace(/\D/g, '');
                  if (phoneNumbers.length < 10) {
                    alert('Digite um telefone válido com DDD.');
                    return;
                  }
                  handleRegister();
                }}
              >
                Criar conta
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">ou</span>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl h-12 border-gray-300" onClick={() => onLogin(null, false)}>
              Continuar sem conta
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              * Você não poderá avaliar locais sem uma conta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
