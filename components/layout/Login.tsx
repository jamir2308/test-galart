'use client';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/form/Input';
import { FormData, LoginFormProps } from '@/types/component.types';



export default function LoginForm({ onSubmit, error }: LoginFormProps) {
    const { register, handleSubmit } = useForm<FormData>({
        defaultValues: {
          email: '',
          password: '',
          remember: false,
        }
      });

      const handleFormSubmit = (data: FormData) => {
        onSubmit({ email: data.email, password: data.password });
    };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <h1 className="text-primary text-4xl font-bold text-center">GALART</h1>
      <p className="font-bold text-gray-500 text-center mb-4">
        Ingresa tu correo y contraseña
      </p>

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="tucorreo@ejemplo.com"
        {...register('email', { 
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Ingresa un correo válido'
            }
          })}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        {...register('password', { required: 'La contraseña es obligatoria' })}
      />
        {error && <p className="text-sm text-red-500">{error}</p>}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/60"
          {...register('remember')}
        />
        Recuérdame
      </label>

      <button
        type="submit"
        className="rounded-lg bg-primary py-3 font-semibold text-white transition hover:opacity-90"
      >
        Iniciar sesión
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <a href="/register" className="text-primary hover:underline font-bold">
          Regístrate
        </a>
      </p>
    </form>
  );
}
