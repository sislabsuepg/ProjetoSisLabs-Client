export interface ApiError {
  response?: {
    data?: {
      erros?: string[];
    };
  };
  message?: string;
}