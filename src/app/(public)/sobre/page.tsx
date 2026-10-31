import TituloSobre from "./_components/TituloSobre";
import GlobeSobre from "./_components/GlobeSobre";
import ComoComecou from "./_components/ComoComecou";
import AssimNasceu from "./_components/AssimNasceu";
import ProjetoELinks from "./_components/ProjetoELinks";
import Fechamento from "./_components/Fechamento";

export default function Sobre() {
   return (
      <main>
         <TituloSobre />
         <GlobeSobre />
         <ComoComecou />
         <AssimNasceu />
         <ProjetoELinks/>
         <Fechamento/>
     
      </main>
   );
}