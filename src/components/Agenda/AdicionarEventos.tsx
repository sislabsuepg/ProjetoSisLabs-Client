import { useEffect, useState } from "react";
import {
  capitalize,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ILaboratorio } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function AdicionarEventos() {
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nome: "",
    data: "",
    hora: "",
    duracao: 0,
    responsavel: "",
    idLaboratorio: 0, // Mantido como string para o Select
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setForm({ ...form, idLaboratorio: Number(e.target.value) });
  };

  const isFormValid =
    form.nome.trim().length > 0 &&
    form.data.trim().length > 0 &&
    form.duracao > 0 &&
    form.responsavel.trim().length > 0 &&
    form.idLaboratorio > 0 &&
    form.hora.trim().length > 0 &&
    new Date(`${form.data}T${form.hora}:00`) > new Date();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    async function salvarEvento() {
      try {
        await apiOnline.post("/evento", {
          nome: form.nome,
          dataEvento: new Date(`${form.data}T${form.hora}:00`),
          duracao: form.duracao,
          responsavel: form.responsavel,
          idLaboratorio: form.idLaboratorio,
        });
        setForm({
          nome: "",
          data: "",
          hora: "",
          duracao: 0,
          responsavel: "",
          idLaboratorio: 0,
        });
        toast.success("Evento adicionado com sucesso!");
      } catch {
        toast.error("Erro ao adicionar evento.");
      }
    }
    salvarEvento();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const laboratoriosResponse = await apiOnline.get<ILaboratorio[] | { data: ILaboratorio[] }>(
          "/laboratorio"
        );
        console.log(laboratoriosResponse);
        const responseData = laboratoriosResponse as {
          data: ILaboratorio[] | { data?: ILaboratorio[] };
        };
        const labData = Array.isArray(responseData.data)
          ? (responseData.data as ILaboratorio[])
          : ((responseData.data as { data?: ILaboratorio[] }).data || []);
        setLaboratorios(labData);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          const data = err.response?.data as { erros?: string[] } | undefined;
          if (data?.erros && data.erros.length > 0) {
            data.erros.forEach((e) => toast.error(e));
          } else {
            toast.error("Erro ao buscar dados. Tente novamente.");
          }
        } else {
          toast.error("Erro ao buscar dados. Tente novamente.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <div className="flex flex-col h-full">
        <p className="font-semibold text-[1.2rem] text-theme-blue mb-2">
          📝 Adicionar eventos
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
        >
          <div className="space-y-4">
            <div className="w-full flex items-center gap-4">
              <TextField
                id="nome-evento"
                label="Nome do evento"
                variant="filled"
                type="text"
                name="nome"
                value={form.nome ? capitalize(form.nome) : ""}
                onChange={handleChange}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              />

              <TextField
                id="data-evento"
                variant="filled"
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              />

              <TextField
                id="hora-evento"
                variant="filled"
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              />
            </div>

            <div className="w-full flex items-center gap-4">
              <TextField
                id="duracao-evento"
                label="Duração do evento (minutos)"
                variant="filled"
                type="number"
                name="duracao"
                value={form.duracao}
                onChange={handleChange}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md"
                inputProps={{ min: 0 }}
              />

              <TextField
                id="responsavel-evento"
                label="Nome do responsável"
                variant="filled"
                type="text"
                name="responsavel"
                value={form.responsavel}
                onChange={handleChange}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              />
            </div>

            <FormControl className="w-full" variant="filled">
              <InputLabel>Laboratório</InputLabel>
              <Select
                name="idLaboratorio"
                value={form.idLaboratorio}
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>-- Selecione uma opção --</MenuItem>
                {laboratorios.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {`${l.numero} - ${l.nome}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="w-full flex items-center justify-end">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
                ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
