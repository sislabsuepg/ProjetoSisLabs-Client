"use client";

import Pagination from "@/components/Pagination";
import {ApiResponse, IEmprestimo} from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
//import { useCookies } from "react-cookie";
import { apiOnline } from "@/services/services";
import { CircularProgress } from "@mui/material";

export default function Inicio() {
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  //const [cookies] = useCookies(["usuario"]);
  const [data, setData] = useState<IEmprestimo[]>([]);
  useEffect(() => {
    async function fetchData() {
      try{
        const countResponse = await apiOnline.get<{count: number}>("/emprestimo/count");
        const count = countResponse?.count ?? 0;
        const response = await apiOnline.get(`/emprestimo?page=${currentPage}&items=${itemsPerPage}`);
        const data: IEmprestimo[] = Array.isArray(response)
        ? response
        : (response as ApiResponse).data || [];
      setTotalPages(Math.ceil(count / itemsPerPage));
      setData(data);
    }catch(e){
      console.error(e);
    }finally{
      setLoading(false);
    }
  }
    fetchData();
  }, [currentPage])

  if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress size={40} />
        </div>
      )
    }
  
  return (
    <div className="w-full flex flex-col h-full items-start">
      <p className="text-theme-blue font-semibold text-[1.2rem] w-full text-start">
        Laboratórios em uso
      </p>

      <div className="w-full flex flex-col h-full mt-5">
        {data?.map((item) => (
          <div
            key={item?.id}
            className={`w-full flex items-center gap-2 ${
              Number(item?.id) % 2 == 0 ? "bg-transparent" : "bg-[#F3F3F3]"
            } h-12 py-2 px-4 rounded-[10px]`}
          >
            <div className="h-2 w-2 bg-[#22FF00] rounded-full"></div>
            <p className="text-theme-text text-[0.9rem] font-normal">
              Laboratório <span className="font-semibold">{item?.laboratorio.nome}</span> -
              Chave do Laboratório {item?.laboratorio.nome} foi emprestado pelo(a) aluno(a){" "}
              <span className="font-semibold">{item?.aluno.nome}</span> -{" "}
              {item?.dataHoraEntrada ? new Date(item.dataHoraEntrada).toLocaleString():""}
            </p>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
