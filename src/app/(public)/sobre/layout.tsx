import RolagemSuave from "./_components/RolagemSuave";
import "./rolagem.css";

export default function SobreLayout({ children }: LayoutProps<"/sobre">) {
    return (
        <div className="sobre-rolagem">
            <RolagemSuave />
            {children}
        </div>
    );
}
