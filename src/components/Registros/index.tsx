import { IRegistro } from "@/interfaces/interfaces";

interface Props {
  list: IRegistro[];
}

export default function ListaRegistros({ list }: Props) {
  return (
    <div>
      <table className="h-full min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase w-1/4">
              Login
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase w-1/4">
              Nome
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase w-1/4">
              Data / Hora
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase w-1/4">
              Descrição
            </th>
          </tr>
        </thead>
        <tbody className="h-full min-w-full">
          {list.length > 0 ? (
            list.map((registro, index) => (
              <tr
                key={registro.id}
                className={`${
                  index % 2 === 0 ? "bg-[#F5F5F5]" : "bg-white"
                } border-b last:border-0 h-fit`}
              >
                <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/4">
                  {registro.usuario?.login || "-"}
                </td>
                <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/4">
                  {registro.usuario?.nome || "-"}
                </td>
                <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/4">
                  {new Date(registro.dataHora).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/4">
                  {registro.descricao}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-4 text-center text-sm text-theme-blue font-normal"
              >
                Nenhum registro encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
