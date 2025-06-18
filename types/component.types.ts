import { InputHTMLAttributes } from 'react';
import type { Artwork } from './api.types';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export interface ArtworkGridProps {
  initialArtworks: Artwork[];
  totalPages: number;
  iiifBaseUrl: string;
}

export type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

export interface LoginFormProps {
  onSubmit: (data: Pick<FormData, 'email' | 'password'>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface ArtworkCardProps {
  artwork: Artwork;
  iiifBaseUrl: string;
  priority?: boolean;
}