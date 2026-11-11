import { Suspense } from "react"
import Header from "./_components/header"
import Upload from "./_components/upload"
import Banner from "./_components/banner"

const AnaliseCurriculo = () => {
    return(
        <div className="flex flex-col gap-8">
            <Header/>
            <Upload/>
            <Suspense fallback={null}>
            <Banner />
            </Suspense>
        </div>
    )
}

export default AnaliseCurriculo