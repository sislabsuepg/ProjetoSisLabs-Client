"use client";

import Pagination from "@/components/Pagination";
import { ApiResponse, IEmprestimo } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
//import { useCookies } from "react-cookie";
import { apiOnline } from "@/services/services";
import { CircularProgress, Popover } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import CustomModal from "@/components/CustomModal";

export default function Inicio() {
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [update, setUpdate] = useState(false);
  const [openEncerrar, setOpenEncerrar] = useState<{ status: boolean; id: number }>({ status: false, id: 0 });
  //const [cookies] = useCookies(["usuario"]);
  const [data, setData] = useState<IEmprestimo[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const countResponse = await apiOnline.get<{ count: number }>(
          "/emprestimo/count"
        );
        const count = countResponse?.count ?? 0;
        const response = await apiOnline.get(
          `/emprestimo?page=${currentPage}&items=${itemsPerPage}`
        );
        const data: IEmprestimo[] = Array.isArray(response)
          ? response
          : (response as ApiResponse).data || [];
        setTotalPages(Math.ceil(count / itemsPerPage));
        setData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, update]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full items-start">
      <p className="text-theme-blue font-semibold text-[1.2rem] w-full text-start">
        ✅ Laboratórios em uso
      </p>

      <div className="w-full flex flex-col h-full mt-5">
        {data.length > 0 ? (
          data?.map((item) => (
            <div
              key={item?.id}
              className={`w-full flex items-center gap-2 ${Number(item?.id) % 2 == 0 ? "bg-transparent" : "bg-[#F3F3F3]"
                } h-12 py-2 px-4 rounded-[10px]`}
            >
              <div className="h-2 w-2 bg-[#22FF00] rounded-full"></div>
              <p className="text-theme-text text-[0.9rem] font-normal">
                {item.posseChave ? (
                  <>
                    Laboratório{" "}
                    <span className="font-semibold">
                      {item?.laboratorio.nome}
                    </span>{" "}
                    - Chave do Laboratório {item?.laboratorio.nome} foi
                    emprestado pelo(a) aluno(a){" "}
                    <span className="font-semibold">{item?.aluno?.nome || "-"}</span> -{" "}
                    {item?.dataHoraEntrada
                      ? new Date(item.dataHoraEntrada).toLocaleString()
                      : ""}<Cancel className="text-theme-red" sx={{ width: 22, height: 22 }}/>
                  </>
                ) : (
                  <>
                    Laboratório{" "}
                    <span className="font-semibold">
                      Laboratório {item?.laboratorio.nome}
                    </span>{" "}
                    foi aberto pelo(a) aluno(a){" "}
                    <span className="font-semibold">
                      {item?.aluno?.nome || "-"} para pesquisa
                    </span>{" "}
                    - :{" "}
                    {item?.dataHoraEntrada
                      ? new Date(item.dataHoraEntrada).toLocaleString()
                      : ""}<Cancel className="text-theme-red ml-2" sx={{ width: 22, height: 22 }} onClick={
                        () => setOpenEncerrar({ status: true, id: item.id })
                      }/>
                  </>
                )}
              </p>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-theme-text text-[0.9rem] font-normal">
              Nenhum laboratório em uso no momento.
            </p>
          </div>
        )}

        <CustomModal
          open={openEncerrar.status}
          onClose={() => setOpenEncerrar({ status: false, id: 0 })}
          title="Encerrar Uso do Laboratório"
          message={`Tem certeza que deseja encerrar o emprestimo para ${data.find(item => item.id === openEncerrar.id)?.aluno.nome} no laboratório ${data.find(item => item.id === openEncerrar.id)?.laboratorio.nome}?`}
          onConfirm={async () => {
            try{
              await apiOnline.put(`/emprestimo/close/${openEncerrar.id}`, {idUsuario: 1})
              setData(data.filter(item => item.id !== openEncerrar.id));
              setOpenEncerrar({ status: false, id: 0 });
            }catch(e){
              console.error(e);
              setOpenEncerrar({ status: false, id: 0 });
            }finally{
              setUpdate(!update);
            }
          }}
          onCancel={() => setOpenEncerrar({ status: false, id: 0 })}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
